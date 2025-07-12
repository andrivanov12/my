import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml', 'images/*.{png,jpg,webp}'],
      manifest: {
        name: 'AI Market Hub - ChatGPT без регистрации',
        short_name: 'AI Chat',
        description: 'Бесплатный доступ к ChatGPT и другим AI моделям без необходимости регистрации',
        theme_color: '#7c3aed',
        icons: [
          {
            src: '/images/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 дней
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ];

  return {
    plugins,
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/woff|woff2|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          manualChunks: {
            // React packages only in vendor chunk
            vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
            // Other utilities in separate chunk
            utils: ['axios', 'js-cookie', 'uuid']
          }
        }
      },
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
      target: 'es2015',
    },
    server: {
      hmr: {
        overlay: false
      }
    },
    assetsInclude: ['**/*.webp', '**/*.avif'],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        'axios',
        'js-cookie',
        'uuid',
        'react-helmet-async'
      ]
    },
    // SEO оптимизация для статических ресурсов
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    // Предварительная загрузка ресурсов
    preview: {
      headers: { 'Cache-Control': 'public, max-age=31536000' }
    }
  };
});