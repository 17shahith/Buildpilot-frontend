import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const defaultApiUrl = mode === 'development' ? '' : 'https://buildpilot-backend-1.onrender.com';
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://buildpilot-backend-1.onrender.com',
          changeOrigin: true,
          secure: false
        }
      }
    },
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(env.NEXT_PUBLIC_API_URL || defaultApiUrl),
    }
  };
})
