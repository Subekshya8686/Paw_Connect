import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server/ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server/ssl/cert.pem')),
    },
    port: 5173,
    host: 'localhost'
  },
  preview: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server/ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server/ssl/cert.pem')),
    },
    port: 4173,
    host: 'localhost'
  }
})
