import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';


export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  minify: true,
  external: [
    '@lucidjs/core',
    '@lucidjs/web'
  ],
  banner: {
    js: '#!/usr/bin/env node',  // automatically inject the node shebang at the top of the compiled file
  },
  onSuccess: async () => {
    const serverBoilerplateSrc = path.resolve(__dirname, '../server-boilerplate/');
    const serverBoilerplateDest = path.resolve(__dirname, 'dist/boilerplate/server/');
    fs.cpSync(serverBoilerplateSrc, serverBoilerplateDest, { recursive: true, });

    ['node_modules', 'test-results'].forEach(dirName => {
      const dirPath = path.join(serverBoilerplateDest, dirName);
      if (dirPath) fs.rmSync(dirPath, { recursive: true, force: true });
    });
  },
});
