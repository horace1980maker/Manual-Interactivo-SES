import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '') // usa import.meta.env para valores públicos VITE_*
  return {
    base: './',                // 👈 clave para desplegar en subcarpetas
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react()],
    // ❌ Evita inyectar secretos al cliente:
    // define: {
    //   'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    //   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    // },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
  }
})

