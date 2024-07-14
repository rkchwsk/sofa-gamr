import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/sofa-gamr/',  // Ensure you have the correct base path for GitHub Pages
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: ['style.css'],
    },
  },
});