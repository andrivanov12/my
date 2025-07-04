import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      fileName: (file) => path.relative(path.resolve(__dirname, 'dist'), file) + '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      fileName: (file) => path.relative(path.resolve(__dirname, 'dist'), file) + '.br',
    }),
  ],
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
});