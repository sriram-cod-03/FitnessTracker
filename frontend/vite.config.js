import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Put node_modules dependencies into a vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('bootstrap')) return 'vendor-bootstrap';
            return 'vendor-libs';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600, // Slightly increase threshold for styles
  },
});