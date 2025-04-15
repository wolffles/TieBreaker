import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Add any path aliases you were using with react-scripts
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // Match the default React Scripts port
    host: true, // Expose to all network interfaces
  },
  // Heroku-specific configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for production
  },
  // Configure esbuild to handle JSX in .js files
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}); 