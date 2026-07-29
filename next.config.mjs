/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Static Export ───────────────────────────────────────────────────────────
  // Tells Next.js to produce a fully static `out/` folder instead of a Node.js
  // server bundle. Every page is pre-rendered to HTML at build time.
  output: 'export',

  // Appends a trailing slash to every route so that /about → /about/index.html.
  // S3 static website hosting (and CloudFront pointing at it) natively serves
  // index.html from a "directory", which means /about/ resolves without any
  // server-side rewrite rules.
  trailingSlash: true,

  // ─── TypeScript / ESLint ─────────────────────────────────────────────────────
  typescript: {
    // Already present: skips type errors that would abort the export build.
    ignoreBuildErrors: true,
  },

  eslint: {
    // Prevents ESLint warnings from aborting the export build.
    ignoreDuringBuilds: true,
  },

  // ─── Images ──────────────────────────────────────────────────────────────────
  // `unoptimized: true` disables the Next.js Image Optimization API (which
  // requires a running server). Static export requires this; images are served
  // as-is from the `out/` folder or from your CDN (CloudFront).
  images: {
    unoptimized: true,
  },
}

export default nextConfig
