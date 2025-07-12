import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

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
            // React packages only in one chunk
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