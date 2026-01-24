import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nido/',
  server: {
    host: true,
    port: 3005,
    allowedHosts: [
      'synology.tail69424a.ts.net'
    ],
    proxy: {
      '/nido_api': {
        target: 'http://nido-web-backend:8008', // Docker service name
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/nido_api/, '')
      },
      // Fallback for local dev if not using docker-compose networking
      // If we are outside docker, we might need localhost:8008. 
      // But since we run in docker, 'nido-web-backend' is correct.
    },
    hmr: {
      // clientPort removed to allow auto-detection or proxy usage
    },
    watch: {
      usePolling: true
    }
  }
})
