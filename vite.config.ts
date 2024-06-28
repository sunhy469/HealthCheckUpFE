import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  server: {
    host: "localhost",
    open: true,
    port: 3000,

    proxy:{
      "/api1":{
        target:"http://localhost:8080",
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api1/,"")
      },
    },
  },
})
