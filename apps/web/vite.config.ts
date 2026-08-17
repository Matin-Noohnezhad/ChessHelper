import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pkg = (name: string) =>
  fileURLToPath(new URL(`../../packages/${name}/src/index.ts`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The workspace packages ship TypeScript source rather than a build step,
    // so point Vite straight at it. Nothing here is web-specific — the same
    // packages will be aliased the same way by React Native and Tauri.
    alias: {
      '@coh/chess-core': pkg('chess-core'),
      '@coh/opening-book': pkg('opening-book'),
      '@coh/trainer': pkg('trainer'),
      '@coh/imbalances': pkg('imbalances'),
      '@coh/review': pkg('review'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // The ECO tables are large, static and change far less often than the
        // app code. Splitting them out means a UI deploy does not invalidate
        // the book in anyone's cache.
        manualChunks: { book: ['@coh/opening-book'] },
      },
    },
  },
  server: { port: 5173, open: false },
});
