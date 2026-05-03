import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' // 1. インポート

export default defineConfig({
  plugins: [
    react(), 
    svgr() // 2. 追加
  ],
})