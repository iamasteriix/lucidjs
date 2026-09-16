import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { tmpdir } from 'os';
import { initCommand } from './index';
import { scaffoldServer } from './server';
import fs from 'fs';
import path from 'path';


// mock ONLY interactive prompts and npm install execution
vi.mock('inquirer');
vi.mock('child_process', () => ({
  default: { execSync: vi.fn() },
  execSync: vi.fn(),
}));


describe(
  'scaffolding pipeline',
  () => {
    let tempDir: string;
    let targetDir: string;

    beforeEach(
      () => {
        // create a real temporary workspace on disk per test
        tempDir = fs.mkdtempSync(path.join(tmpdir(), 'lucid-test-'));
        targetDir = path.join(tempDir, 'test-scaffolded-app');

        // redirect boilerplate lookup to local dev path if dist doesn't exist yet
        const originalResolve = path.resolve;
        vi.spyOn(path, 'resolve').mockImplementation((...args) => {
          if (args.includes('boilerplates')) {
            const distBoilerplate = originalResolve(__dirname, '../../dist/boilerplates/server');
            const sourceBoilerplate = originalResolve(__dirname, '../../boilerplates/server');
            return fs.existsSync(distBoilerplate) ? distBoilerplate : sourceBoilerplate;
          }
          return originalResolve(...args);
        });

        // Copy boilerplate to targetDir so scaffoldServer has files to work on
        const boilerplateDir = path.resolve('boilerplates');
        fs.cpSync(boilerplateDir, targetDir, { recursive: true });
    });

    afterEach(() => {
      vi.restoreAllMocks();
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it(
      'registers CLI flags correctly',
      () => {
        expect(initCommand.name()).toBe('init');
        const optionNames = initCommand.options.map((o) => o.long);
        expect(optionNames).toContain('--tests');
        expect(optionNames).toContain('--docs');
        expect(optionNames).toContain('--telemetry');
    });

    it(
      'scaffolds app on disk, updates package.json, and strips telemetry when off',
      async () => {
        await scaffoldServer(
          'test-scaffolded-app',
          {
            tests: 'on',
            docs: 'on',
            telemetry: 'off',
          },
          targetDir
        );

        // check package.json mutation on disk
        const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
        expect(pkg.name).toBe('test-scaffolded-app');
        expect(Object.keys(pkg.dependencies || {}).some((d) => d.startsWith('@opentelemetry/'))).toBe(false);

        // verify actual disk removals
        expect(fs.existsSync(path.join(targetDir, 'src/telemetry'))).toBe(false);
    });

    it(
      'prunes docs and performs real AST modifications on src/app/routes.ts when --docs off is passed',
      async () => {
        await scaffoldServer(
          'test-scaffolded-app',
          {
            docs: 'off',
            tests: 'on',
            telemetry: 'on',
          },
          targetDir
        );

        // Check dependency removal on disk
        const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
        expect(pkg.dependencies['swagger-jsdoc']).toBeUndefined();
        expect(pkg.dependencies['swagger-ui-express']).toBeUndefined();

        // Verify file removal on disk
        expect(fs.existsSync(path.join(targetDir, 'src/config/swagger.ts'))).toBe(false);

        // Check AST modification on actual routes.ts file
        const routesPath = path.join(targetDir, 'src/app/routes.ts');
        if (fs.existsSync(routesPath)) {
          const routesContent = fs.readFileSync(routesPath, 'utf-8');
          expect(routesContent).not.toContain('swagger-ui-express');
          expect(routesContent).not.toContain('swaggerUi.serve');
        }
    });

    it(
      'prunes test files and vitest/playwright configs based on scope on disk',
      async () => {
        await scaffoldServer(
          'test-scaffolded-app',
          {
            tests: 'on',
            testScope: ['unit'],
            docs: 'off',
            telemetry: 'on',
          },
          targetDir
        );

        const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8'));
        expect(pkg.scripts['test:unit']).toBeDefined();
        expect(pkg.scripts['test:e2e']).toBeUndefined();

        expect(fs.existsSync(path.join(targetDir, 'playwright.config.ts'))).toBe(false);
    });
});