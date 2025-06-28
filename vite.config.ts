import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Оптимизация сборки
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Удаляем console.log в продакшене
        drop_debugger: true,
      },
    },
    // Разделение кода для лучшего кэширования
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          utils: ['axios', 'js-cookie', 'uuid']
        }
      }
    },
    // Сжатие ресурсов
    cssCodeSplit: true,
    sourcemap: false, // Отключаем sourcemap в продакшене
    // Оптимизация размера чанков
    chunkSizeWarningLimit: 1000,
  },
  // Оптимизация для разработки
  server: {
    hmr: {
      overlay: false
    }
  },
  // Предварительная загрузка зависимостей
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'axios',
      'js-cookie',
      'uuid'
    ]
  }
});