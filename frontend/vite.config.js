import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_API_URI' : JSON.stringify(process.env.REACT_API_URI)
  }
})
