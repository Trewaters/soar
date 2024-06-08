module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /prisma\/generated\/client\/runtime\/library.js/,
        use: 'null-loader',
      })
    }

    config.module.exprContextCritical = false

    return config
  },
}
