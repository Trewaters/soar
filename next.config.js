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
module.exports = {
  output: 'standalone',
}
