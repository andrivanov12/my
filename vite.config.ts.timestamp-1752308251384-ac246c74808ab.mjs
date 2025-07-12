// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import compression from "file:///home/project/node_modules/vite-plugin-compression/dist/index.mjs";
import imagemin from "file:///home/project/node_modules/vite-plugin-imagemin/dist/index.mjs";
var vite_config_default = defineConfig(({ command }) => {
  const plugins = [react()];
  if (command === "build") {
    plugins.push(
      compression({
        algorithm: "gzip",
        ext: ".gz"
      }),
      compression({
        algorithm: "brotliCompress",
        ext: ".br"
      }),
      imagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 80
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: "removeViewBox",
              active: false
            },
            {
              name: "removeEmptyAttrs",
              active: false
            }
          ]
        }
      })
    );
  }
  return {
    plugins,
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IGltYWdlbWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+IHtcbiAgY29uc3QgcGx1Z2lucyA9IFtyZWFjdCgpXTtcblxuICAvLyBPbmx5IGFkZCBjb21wcmVzc2lvbiBhbmQgaW1hZ2VtaW4gcGx1Z2lucyBkdXJpbmcgYnVpbGRcbiAgaWYgKGNvbW1hbmQgPT09ICdidWlsZCcpIHtcbiAgICBwbHVnaW5zLnB1c2goXG4gICAgICBjb21wcmVzc2lvbih7XG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgICBleHQ6ICcuZ3onLFxuICAgICAgfSksXG4gICAgICBjb21wcmVzc2lvbih7XG4gICAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgICAgZXh0OiAnLmJyJyxcbiAgICAgIH0pLFxuICAgICAgaW1hZ2VtaW4oe1xuICAgICAgICBnaWZzaWNsZToge1xuICAgICAgICAgIG9wdGltaXphdGlvbkxldmVsOiA3LFxuICAgICAgICAgIGludGVybGFjZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBvcHRpcG5nOiB7XG4gICAgICAgICAgb3B0aW1pemF0aW9uTGV2ZWw6IDcsXG4gICAgICAgIH0sXG4gICAgICAgIG1vempwZWc6IHtcbiAgICAgICAgICBxdWFsaXR5OiA4MCxcbiAgICAgICAgfSxcbiAgICAgICAgcG5ncXVhbnQ6IHtcbiAgICAgICAgICBxdWFsaXR5OiBbMC44LCAwLjldLFxuICAgICAgICAgIHNwZWVkOiA0LFxuICAgICAgICB9LFxuICAgICAgICBzdmdvOiB7XG4gICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncmVtb3ZlVmlld0JveCcsXG4gICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAncmVtb3ZlRW1wdHlBdHRycycsXG4gICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnMsXG4gICAgYnVpbGQ6IHtcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAgIGNvcmU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAgIHJvdXRlcjogWydyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgICBpY29uczogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAgIHV0aWxzOiBbJ2F4aW9zJywgJ2pzLWNvb2tpZScsICd1dWlkJ11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMjAwLFxuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG1yOiB7XG4gICAgICAgIG92ZXJsYXk6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICBhc3NldHNJbmNsdWRlOiBbJyoqLyoud2VicCcsICcqKi8qLmF2aWYnXSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3JlYWN0JyxcbiAgICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICAgJ2x1Y2lkZS1yZWFjdCcsXG4gICAgICAgICdheGlvcycsXG4gICAgICAgICdqcy1jb29raWUnLFxuICAgICAgICAndXVpZCcsXG4gICAgICAgICdyZWFjdC1oZWxtZXQtYXN5bmMnXG4gICAgICBdXG4gICAgfSxcbiAgICAvLyBTRU8gXHUwNDNFXHUwNDNGXHUwNDQyXHUwNDM4XHUwNDNDXHUwNDM4XHUwNDM3XHUwNDMwXHUwNDQ2XHUwNDM4XHUwNDRGIFx1MDQzNFx1MDQzQlx1MDQ0RiBcdTA0NDFcdTA0NDJcdTA0MzBcdTA0NDJcdTA0MzhcdTA0NDdcdTA0MzVcdTA0NDFcdTA0M0FcdTA0MzhcdTA0NDUgXHUwNDQwXHUwNDM1XHUwNDQxXHUwNDQzXHUwNDQwXHUwNDQxXHUwNDNFXHUwNDMyXG4gICAgZGVmaW5lOiB7XG4gICAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lm5wbV9wYWNrYWdlX3ZlcnNpb24pLFxuICAgIH0sXG4gICAgLy8gXHUwNDFGXHUwNDQwXHUwNDM1XHUwNDM0XHUwNDMyXHUwNDMwXHUwNDQwXHUwNDM4XHUwNDQyXHUwNDM1XHUwNDNCXHUwNDRDXHUwNDNEXHUwNDMwXHUwNDRGIFx1MDQzN1x1MDQzMFx1MDQzM1x1MDQ0MFx1MDQ0M1x1MDQzN1x1MDQzQVx1MDQzMCBcdTA0NDBcdTA0MzVcdTA0NDFcdTA0NDNcdTA0NDBcdTA0NDFcdTA0M0VcdTA0MzJcbiAgICBwcmV2aWV3OiB7XG4gICAgICBoZWFkZXJzOiB7ICdDYWNoZS1Db250cm9sJzogJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcgfVxuICAgIH1cbiAgfTtcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sY0FBYztBQUdyQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsTUFBTTtBQUMzQyxRQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFHeEIsTUFBSSxZQUFZLFNBQVM7QUFDdkIsWUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLE1BQ0QsWUFBWTtBQUFBLFFBQ1YsV0FBVztBQUFBLFFBQ1gsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLE1BQ0QsU0FBUztBQUFBLFFBQ1AsVUFBVTtBQUFBLFVBQ1IsbUJBQW1CO0FBQUEsVUFDbkIsWUFBWTtBQUFBLFFBQ2Q7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNQLG1CQUFtQjtBQUFBLFFBQ3JCO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxTQUFTO0FBQUEsUUFDWDtBQUFBLFFBQ0EsVUFBVTtBQUFBLFVBQ1IsU0FBUyxDQUFDLEtBQUssR0FBRztBQUFBLFVBQ2xCLE9BQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxNQUFNO0FBQUEsVUFDSixTQUFTO0FBQUEsWUFDUDtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sY0FBYztBQUFBLFlBQ1osTUFBTSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxZQUMvQyxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsWUFDN0IsUUFBUSxDQUFDLGtCQUFrQjtBQUFBLFlBQzNCLE9BQU8sQ0FBQyxjQUFjO0FBQUEsWUFDdEIsT0FBTyxDQUFDLFNBQVMsYUFBYSxNQUFNO0FBQUEsVUFDdEM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsY0FBYztBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsdUJBQXVCO0FBQUEsTUFDdkIsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLEtBQUs7QUFBQSxRQUNILFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZSxDQUFDLGFBQWEsV0FBVztBQUFBLElBQ3hDLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLGlCQUFpQixLQUFLLFVBQVUsUUFBUSxJQUFJLG1CQUFtQjtBQUFBLElBQ2pFO0FBQUE7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQLFNBQVMsRUFBRSxpQkFBaUIsMkJBQTJCO0FBQUEsSUFDekQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
