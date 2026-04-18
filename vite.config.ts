import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  esbuild: mode === 'production'
    ? {
        drop: ['console', 'debugger'],
      }
    : undefined,
  build: {
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-core';
          }

          if (id.includes('/data/blog/') || id.includes('/utils/blog')) {
            return 'blog-content';
          }

          if (id.includes('/data/products') || id.includes('/utils/productSeo')) {
            return 'product-catalog';
          }

          return undefined;
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
}));
