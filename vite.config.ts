import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { qrcode } from 'vite-plugin-qrcode'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), qrcode()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  envPrefix: 'COASTLINE_APP_',
  server: {
    port: 3000,
  },
})
