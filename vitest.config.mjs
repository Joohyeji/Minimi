import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.jsx', 'src/**/*.js'],
      exclude: [
        'node_modules/',
        'test/',
        'src/firebase.js',
        'src/preload',
        'src/renderer/src/main.jsx'
      ]
    }
  }
})
