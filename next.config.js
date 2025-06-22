/** @type {import("next").NextConfig} */
// fix prisma Query engine issues
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const nextConfig = {
  output: 'standalone',
  images: {
    // Configure image domains and loaders
    domains: [],
    remotePatterns: [
      // Add patterns for external image sources if needed
      // { protocol: 'https', hostname: 'your-cloudflare-domain.com' }
    ],
    // Handle unoptimized images (like base64 data URLs)
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

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
