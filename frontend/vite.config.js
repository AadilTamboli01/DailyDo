import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ✅ Tailwind v4 plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()  // ✅ ये add करें
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
