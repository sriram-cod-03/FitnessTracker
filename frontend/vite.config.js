import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Drops all dead weight, console lines, and comments from production scripts
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
            // Isolates heavy framework pieces so they don't block the initial paint execution pass
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
  },
});