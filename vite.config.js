import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function qrFunctionBase() {
  const configured = process.env.QR_FUNCTION_URL
  if (configured) return new URL(configured)
  try {
    const project = JSON.parse(readFileSync(resolve(process.cwd(), '.firebaserc'), 'utf8')).projects?.default
    if (project) return new URL(`https://asia-south1-${project}.cloudfunctions.net/qrApi`)
  } catch {}
  return new URL('http://localhost:8787')
}

const qrFunction = qrFunctionBase()

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/qr': {
        target: qrFunction.origin,
        changeOrigin: true,
        rewrite: (path) => `${qrFunction.pathname.replace(/\/$/, '')}${path}`,
      },
    },
  },
})
