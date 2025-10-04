import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 10000,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ai-form-builder-jadu.onrender.com',
      '.onrender.com'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
