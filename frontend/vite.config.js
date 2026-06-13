import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('bootstrap')) return 'vendor-bootstrap';
            return 'vendor-libs';
          }
        },
      },
      external: [
        /bootstrap-icons\/font\/fonts\/bootstrap-icons\.woff2/
      ]
    },
    chunkSizeWarningLimit: 600,
  },
});