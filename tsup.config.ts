import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  outDir: 'out',
  splitting: false,
  sourcemap: true,
  minify: false,
  clean: true,
  external: ['vscode'],
  format: 'cjs',
  noExternal: ['date-fns', 'cross-fetch', 'zod'],
});
