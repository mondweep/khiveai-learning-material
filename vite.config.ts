import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/frontend/components'),
      '@/pages': path.resolve(__dirname, './src/frontend/pages'),
      '@/hooks': path.resolve(__dirname, './src/frontend/hooks'),
      '@/store': path.resolve(__dirname, './src/frontend/store'),
      '@/utils': path.resolve(__dirname, './src/frontend/utils'),
      '@/styles': path.resolve(__dirname, './src/frontend/styles'),
      '@/assets': path.resolve(__dirname, './src/frontend/assets'),
      '@/types': path.resolve(__dirname, './src/types')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})