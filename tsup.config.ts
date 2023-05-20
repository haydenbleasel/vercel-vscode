import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/'],
  outDir: 'out',
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  external: ['vscode'],
  format: 'cjs',
});
