// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.module.rules.push({
//         test: /prisma\/generated\/client\/runtime\/library.js/,
//         use: 'null-loader',
//       })
//     }

//     config.module.exprContextCritical = false

//     return config
//   },
//   reactStrictMode: true,
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'Strict-Transport-Security',
//             value: 'max-age=63072000; includeSubDomains; preload',
//           },
//         ],
//       },
//     ]
//   },
// }
/** @type {import("next").NextConfig} */
// fix prisma Query engine issues
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}
