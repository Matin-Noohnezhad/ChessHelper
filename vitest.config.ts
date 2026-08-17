import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const pkg = (name: string) =>
  fileURLToPath(new URL(`./packages/${name}/src/index.ts`, import.meta.url));

export default defineConfig({
  // The workspace packages are consumed as TypeScript source, so tests resolve
  // them the same way the apps do rather than through a build step.
  resolve: {
    alias: {
      '@coh/chess-core': pkg('chess-core'),
      '@coh/opening-book': pkg('opening-book'),
      '@coh/trainer': pkg('trainer'),
      '@coh/imbalances': pkg('imbalances'),
    },
  },
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['packages/**/*.spec.ts', 'apps/**/*.spec.tsx'],
    environment: 'node',
  },
});
