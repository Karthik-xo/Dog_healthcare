import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standard Vite configuration for Render deployments
export default defineConfig({
  plugins: [react()],
  // Use absolute root path for production
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
