import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api-client';

// Product photos are served from S3 with no CORS headers, so loading them
// straight into a <canvas> for segmentation taints it. This proxies through
// our own origin instead — restricted to the hosts product images actually
// come from, so it can't be used to fetch arbitrary URLs.
//
// The backend falls back to disk storage (serving images from its own host)
// when AWS creds aren't configured — next.config.mjs's `*.onrender.com`
// remotePattern covers that for next/image, but a wildcard suffix is too
// broad for this proxy (anyone could stand up an onrender.com app). Instead
// the exact host is derived from the same API base URL the rest of the app
// already uses, so it always matches wherever the backend actually is
// (localhost in dev, the real deployed host in prod) without guessing.
const API_HOST = (() => {
  try {
    // host (not hostname) so the port must match too — otherwise a localhost
    // backend would open every other local port to this proxy.
    return new URL(BASE_URL).host;
  } catch {
    return null;
  }
})();

const ALLOWED_HOSTS = ['halloffashionimages.s3.ap-south-1.amazonaws.com', 'images.unsplash.com'];

function isAllowedHost(host: string) {
  return ALLOWED_HOSTS.includes(host) || host === API_HOST;
}

// SVG can carry <script>/event-handler payloads that execute when the
// browser renders it — nosniff stops MIME-confusion attacks but does
// nothing once the type genuinely is image/svg+xml, so it's excluded here
// even though it's a valid raster-adjacent image type elsewhere.
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const MAX_BYTES = 10 * 1024 * 1024;

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get('url');
  if (!target) {
    return NextResponse.json({ message: 'Missing url parameter' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ message: 'Invalid url' }, { status: 400 });
  }

  if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !isAllowedHost(parsed.host)) {
    return NextResponse.json({ message: 'Host not allowed' }, { status: 400 });
  }

  let upstream: Response;
  try {
    // Reject redirects outright rather than following them — an allowed
    // host redirecting to an internal/disallowed address is exactly the
    // SSRF this allow-list exists to prevent.
    upstream = await fetch(parsed.toString(), { redirect: 'error' });
  } catch {
    return NextResponse.json({ message: 'Failed to fetch image' }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: 'Failed to fetch image' }, { status: 502 });
  }

  const contentType = upstream.headers.get('content-type')?.toLowerCase().split(';')[0].trim();
  if (!contentType || !ALLOWED_CONTENT_TYPES.includes(contentType)) {
    // Not awaited — some upstream servers never settle a stream cancel on an
    // already-buffered small body, and this response shouldn't block on it.
    upstream.body.cancel().catch(() => {});
    return NextResponse.json({ message: 'Upstream did not return a supported image type' }, { status: 502 });
  }

  // ponytail: trusts the declared Content-Length rather than metering bytes
  // as they stream — a malicious allow-listed host could lie about it. Add a
  // byte-counting passthrough stream if that ever matters (all current
  // allow-listed hosts are trusted image stores, not arbitrary origins).
  const contentLength = Number(upstream.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) {
    upstream.body.cancel().catch(() => {});
    return NextResponse.json({ message: 'Image too large' }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
