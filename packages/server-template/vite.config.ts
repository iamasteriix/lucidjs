import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';
import path from 'path';


config({ path: '.env.test', });


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
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
});
