import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  outDir: 'out',
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
  external: ['vscode'],
  format: 'cjs',
});
