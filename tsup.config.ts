import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  outDir: 'out',
  sourcemap: false,
  minify: true,
  format: ['cjs'],
  external: ['vscode'],
  platform: 'node',
});
