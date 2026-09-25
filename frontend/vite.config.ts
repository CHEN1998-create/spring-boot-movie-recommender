import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 开发代理到 Spring Boot（生产由网关/同源部署承接）
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
