import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        history: resolve(__dirname, 'history.html'),
        results: resolve(__dirname, 'results.html'),
        upload: resolve(__dirname, 'upload.html'),
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    open: true,
  },
});
