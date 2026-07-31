/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── TypeScript ──────────────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },

  // ─── Images ──────────────────────────────────────────────────────────────────
  // Deployed on Vercel, which runs a real Next.js server — image optimization
  // and routing work natively. Only external hosts need allow-listing.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'halloffashionimages.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Local dev: backend falls back to disk storage when no AWS creds
        // are configured, serving images from localhost.
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default nextConfig
