import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👈 aquí defines @ como src
    },
  },
  build: {
    sourcemap: true, // ✅ activa los source maps para producción
  },
})
