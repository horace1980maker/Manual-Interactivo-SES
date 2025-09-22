import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',      // <- clave para que funcione en GitHub Pages
  plugins: [react()],
})
