import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Elev8ted Roofs - Web Application Configuration (NOT a Chrome Extension)
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        }
      }
    }
  },
  server: {
    port: 5174,
    strictPort: false,
    host: true
  }
})
