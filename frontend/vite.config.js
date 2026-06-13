import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep Terser active to drop your console logs and compress chunks safely
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Isolating framework pieces cleanly fixes the internal variable mapping crashes
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('bootstrap')) return 'vendor-bootstrap';
            return 'vendor-libs';
          }
        }
      },
      external: [
        /bootstrap-icons\/font\/fonts\/bootstrap-icons\.woff2/
      ]
    },
    chunkSizeWarningLimit: 600,
  }
});