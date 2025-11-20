/** @type {import("next").NextConfig} */

const nextConfig = {
  output: 'standalone',
  images: {
    // Configure image domains and loaders
    domains: [],
    remotePatterns: [
      // Vercel Blob storage pattern
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    // Handle unoptimized images (like base64 data URLs)
    unoptimized: false,
    // Configure allowed quality values for Next.js 16+ compatibility
    qualities: [25, 50, 75, 90, 95, 100],
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      child_process: false,
      dns: false,
      tls: false,
      'timers/promises': false,
      net: false,
    }

    return config
  },
}

module.exports = nextConfig
