import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  //config use process.env to get data from pakeage.json, default is import.meta.env
  define:{
    'process.env':process.env
  },
  plugins: [
    react(),
    svgr()
  ],
  // base: './'
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
