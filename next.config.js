/** @type {import("next").NextConfig} */

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  images: {
    // Configure image domains and loaders
    domains: [],
    remotePatterns: [
      // Vercel Blob storage - public access pattern
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Vercel Blob storage - legacy pattern
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
      },
      // Vercel Blob storage - regional patterns
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      // Vercel Blob storage - all region patterns
      {
        protocol: 'https',
        hostname: 'vercel-storage.com',
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
  // Add aggressive cache-busting headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HTML: no-cache to check for updates on every load
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          // X-Content-Type-Options: prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          // Next.js static assets: aggressive long-term caching with version hash
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          // Service Worker: never cache, always check for updates
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          // Manifest: check for updates frequently
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          // API responses: no cache, always fresh
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, private',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/icon-:size(.*)',
        headers: [
          // App icons: cache but validate
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/offline',
        headers: [
          // Offline page: no cache
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
