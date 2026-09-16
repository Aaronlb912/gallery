import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' && process.env.npm_lifecycle_event === 'build'
    ? '/gallery/'
    : '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 49340,
    strictPort: true,
    watch: {
      ignored: ['**/docs/demo/**'],
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 49340,
    strictPort: true,
  },
})
