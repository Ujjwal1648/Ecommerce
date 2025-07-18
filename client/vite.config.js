import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ecomm': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
})