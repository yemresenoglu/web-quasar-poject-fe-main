// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-config-file
// Vue 3 + Quasar 2 + JavaScript

import { configure } from 'quasar/wrappers'
import path from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default configure(ctx => {
  return {
    boot: ['i18n', 'fonts'],
    css: ['app.sass'],

    extras: ['material-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },

      vueRouterMode: 'history',

      minify: ctx.prod ? 'terser' : false,
      sourcemap: ctx.dev,

      extendWebpack(cfg) {
        // ES modules için resolve ayarları
        cfg.resolve = {
          ...cfg.resolve,
          extensionAlias: {
            '.js': ['.js', '.mjs'],
          },
        }

        // process.env için DefinePlugin (browser'da process tanımlı değil)
        // Not: Quasar otomatik olarak .env dosyasındaki VUE_APP_* değişkenlerini yükler
        // Bu yüzden sadece özel değişkenleri burada tanımlıyoruz
        cfg.plugins.push(
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
              process.env.NODE_ENV || (ctx.dev ? 'development' : 'production')
            ),
            'process.env.VUE_ROUTER_MODE': JSON.stringify('history'),
            'process.env.VUE_ROUTER_BASE': JSON.stringify('/'),
            'process.env.SERVER': JSON.stringify(false),
          })
        )

        // Production için code splitting (Vue 3 + Quasar 2)
        if (ctx.prod) {
          cfg.optimization = {
            ...cfg.optimization,
            splitChunks: {
              chunks: 'all',
              maxInitialRequests: Infinity,
              minSize: 0,
              cacheGroups: {
                vendor: {
                  test: /[\\/]node_modules[\\/](vue|vue-router|vue-i18n)[\\/]/,
                  name: 'vendor',
                  priority: 20,
                },
                quasar: {
                  test: /[\\/]node_modules[\\/]quasar[\\/]/,
                  name: 'quasar',
                  priority: 15,
                },
                charts: {
                  test: /[\\/]node_modules[\\/](chart\.js|vue-chartjs)[\\/]/,
                  name: 'charts',
                  priority: 10,
                },
                utils: {
                  test: /[\\/]node_modules[\\/](axios|date-fns|lodash-es|uuid)[\\/]/,
                  name: 'utils',
                  priority: 5,
                },
              },
            },
          }

          // Chunk size warning limit
          cfg.performance = {
            ...cfg.performance,
            maxEntrypointSize: 1000000,
            maxAssetSize: 1000000,
          }
        }
      },
    },

    devServer: {
      port: 8086,
      open: true,
      https: false,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },

    framework: {
      config: {},
      iconSet: 'material-icons',
      lang: 'tr',
      plugins: ['Notify', 'Dialog', 'Dark', 'LocalStorage'],
    },

    animations: [],

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,

      manifest: {
        name: 'SOMPO Harici Avukat ve Arabulucu Uygulaması',
        short_name: 'SOMPO',
        description: 'Hasar Yönetim Sistemi - Arabuluculuk ve Hasar Dosya Yönetimi',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    },
  }
})
