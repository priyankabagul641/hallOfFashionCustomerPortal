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
    ],
  },
}

export default nextConfig
