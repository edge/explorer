import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chart: [
            'chart.js',
            'vue-chartjs'
          ],
          edge: [
            '@edge/index-utils',
            '@edge/xe-utils'
          ]
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: process.env.NODE_ENV === 'development'
    }
  }
})
