import { defineConfig } from 'vitest/config';
import path from 'path';


export default defineConfig({
  test: {
    globals: true,
    include: [
      'src/**/*.unit.test.ts',
      'src/**/*.i9n.test.ts',
    ],
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
