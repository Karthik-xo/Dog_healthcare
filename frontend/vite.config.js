import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add base path to ensure assets load correctly on static hosts like Render
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
