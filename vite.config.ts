import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import imagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  // Only add compression and imagemin plugins during build
  if (command === 'build') {
    plugins.push(
      compression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      imagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      })
    );
  }

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
          manualChunks: {
            core: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            icons: ['lucide-react'],
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