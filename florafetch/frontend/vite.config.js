import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request starting with /api is forwarded to the Express backend.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Uploaded plant/review photos are served by Express at /uploads.
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
