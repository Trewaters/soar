/** @type {import("next").NextConfig} */
// fix prisma Query engine issues
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

const nextConfig = {
  output: 'standalone',
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
