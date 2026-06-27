import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 后端服务地址（Spring Boot 运行在 8080）
const BACKEND = 'http://localhost:8080'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: false,
    // 注意：/images 不再代理到后端，由 Vite public 目录直接提供
    // 这样前端 public/images/ 下的图片可以被正常访问
    // 若 public 中没有的图片，通过 onImgError 回退到后端原始路径
    proxy: {
      '/api': { target: BACKEND, changeOrigin: true },
      '/user': { target: BACKEND, changeOrigin: true },
      '/quiz': { target: BACKEND, changeOrigin: true },
      '/img': { target: BACKEND, changeOrigin: true },
      '/css': { target: BACKEND, changeOrigin: true },
      '/js': { target: BACKEND, changeOrigin: true },
      '/model': { target: BACKEND, changeOrigin: true }
    }
  }
})
