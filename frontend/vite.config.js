import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard Vite configuration for Render deployments
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Optimization: Reduce chunk size and speed up build
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
        }
      }
    }
  }
})
