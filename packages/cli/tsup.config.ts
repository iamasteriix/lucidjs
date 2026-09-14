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
    const serverTemplateSrc = path.resolve(__dirname, '../server-template/');
    const serverTemplateDest = path.resolve(__dirname, 'dist/templates/server/');
    fs.cpSync(serverTemplateSrc, serverTemplateDest, { recursive: true, });

    const serverNodeModulesDir = path.join(serverTemplateDest, 'node_modules');
    fs.rmSync(serverNodeModulesDir, { recursive: true, force: true });
  },
});
