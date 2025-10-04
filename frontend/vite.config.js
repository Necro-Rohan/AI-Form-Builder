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
    host: '0.0.0.0',
    strictPort: false,
    // allow this external host used by Render/Vercel preview
    allowedHosts: ['jadu-form-builder.onrender.com', 'ai-form-builder2-1.onrender.com']
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
