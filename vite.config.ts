// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Expose env variables
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_CLIENT_ID': JSON.stringify(env.VITE_CLIENT_ID),
      'process.env.VITE_TENANT_ID': JSON.stringify(env.VITE_TENANT_ID),
      'process.env.VITE_REDIRECT_URI': JSON.stringify(env.VITE_REDIRECT_URI),
      global: {},
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
      origin: 'http://localhost:3000',
    }
  }
})