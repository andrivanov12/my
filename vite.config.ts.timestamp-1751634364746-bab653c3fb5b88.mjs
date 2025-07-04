// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import compression from "file:///home/project/node_modules/vite-plugin-compression/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz"
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br"
    })
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          core: ["react", "react-dom", "react-router-dom"],
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["lucide-react"],
          utils: ["axios", "js-cookie", "uuid"]
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    target: "es2015"
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  assetsInclude: ["**/*.webp", "**/*.avif"],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "lucide-react",
      "axios",
      "js-cookie",
      "uuid",
      "react-helmet-async"
    ]
  },
  // SEO оптимизация для статических ресурсов
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  // Предварительная загрузка ресурсов
  preview: {
    headers: { "Cache-Control": "public, max-age=31536000" }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgY29tcHJlc3Npb24oe1xuICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgICBleHQ6ICcuZ3onLFxuICAgIH0pLFxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgIGV4dDogJy5icicsXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIGNvcmU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sXG4gICAgICAgICAgcm91dGVyOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICBpY29uczogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICB1dGlsczogWydheGlvcycsICdqcy1jb29raWUnLCAndXVpZCddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTIwMCxcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlXG4gICAgfVxuICB9LFxuICBhc3NldHNJbmNsdWRlOiBbJyoqLyoud2VicCcsICcqKi8qLmF2aWYnXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ2x1Y2lkZS1yZWFjdCcsXG4gICAgICAnYXhpb3MnLFxuICAgICAgJ2pzLWNvb2tpZScsXG4gICAgICAndXVpZCcsXG4gICAgICAncmVhY3QtaGVsbWV0LWFzeW5jJ1xuICAgIF1cbiAgfSxcbiAgLy8gU0VPIFx1MDQzRVx1MDQzRlx1MDQ0Mlx1MDQzOFx1MDQzQ1x1MDQzOFx1MDQzN1x1MDQzMFx1MDQ0Nlx1MDQzOFx1MDQ0RiBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDQyXHUwNDMwXHUwNDQyXHUwNDM4XHUwNDQ3XHUwNDM1XHUwNDQxXHUwNDNBXHUwNDM4XHUwNDQ1IFx1MDQ0MFx1MDQzNVx1MDQ0MVx1MDQ0M1x1MDQ0MFx1MDQ0MVx1MDQzRVx1MDQzMlxuICBkZWZpbmU6IHtcbiAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxuICB9LFxuICAvLyBcdTA0MUZcdTA0NDBcdTA0MzVcdTA0MzRcdTA0MzJcdTA0MzBcdTA0NDBcdTA0MzhcdTA0NDJcdTA0MzVcdTA0M0JcdTA0NENcdTA0M0RcdTA0MzBcdTA0NEYgXHUwNDM3XHUwNDMwXHUwNDMzXHUwNDQwXHUwNDQzXHUwNDM3XHUwNDNBXHUwNDMwIFx1MDQ0MFx1MDQzNVx1MDQ0MVx1MDQ0M1x1MDQ0MFx1MDQ0MVx1MDQzRVx1MDQzMlxuICBwcmV2aWV3OiB7XG4gICAgaGVhZGVyczogeyAnQ2FjaGUtQ29udHJvbCc6ICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnIH1cbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLE1BQ1YsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLE1BQ1YsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLE1BQU0sQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDL0MsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixPQUFPLENBQUMsY0FBYztBQUFBLFVBQ3RCLE9BQU8sQ0FBQyxTQUFTLGFBQWEsTUFBTTtBQUFBLFFBQ3RDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLHVCQUF1QjtBQUFBLElBQ3ZCLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWUsQ0FBQyxhQUFhLFdBQVc7QUFBQSxFQUN4QyxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixpQkFBaUIsS0FBSyxVQUFVLFFBQVEsSUFBSSxtQkFBbUI7QUFBQSxFQUNqRTtBQUFBO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxTQUFTLEVBQUUsaUJBQWlCLDJCQUEyQjtBQUFBLEVBQ3pEO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
