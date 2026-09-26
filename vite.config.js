import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import proxy from './api/proxy.js'

// Serve the Safari proxy locally too (Vercel runs api/proxy.js as a function in production).
const devApi = {
  name: 'dev-api',
  configureServer(server) {
    server.middlewares.use('/api/proxy', (req, res) => proxy(req, res))
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/proxy', (req, res) => proxy(req, res))
  },
}

export default defineConfig({
  plugins: [react(), devApi],
})
