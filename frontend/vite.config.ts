import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // 后续接 Spring Boot 时放开代理
  // server: {
  //   proxy: {
  //     '/api': 'http://localhost:8080',
  //   },
  // },
})
