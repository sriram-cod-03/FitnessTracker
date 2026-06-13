import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import externalGlobals from 'rollup-plugin-external-globals';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    rollupOptions: {
      // Tells the compiler to look for React globally rather than compiling it into vendor-react.js
      external: [
        'react', 
        'react-dom',
        /bootstrap-icons\/font\/fonts\/bootstrap-icons\.woff2/
      ],
      plugins: [
        externalGlobals({
          react: 'React',
          'react-dom': 'ReactDOM'
        })
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('bootstrap')) return 'vendor-bootstrap';
            return 'vendor-libs';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
});