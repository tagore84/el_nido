import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bga/',
  server: {
    host: true,
    port: 3005,
    hmr: {
      // clientPort removed to allow auto-detection or proxy usage
    },
    watch: {
      usePolling: true
    }
  }
})
