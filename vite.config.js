import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server:{ //跨越配置
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        changeOrigin:true,//是否跨域  修改源
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  }
})
