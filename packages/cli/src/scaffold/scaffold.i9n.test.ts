import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { tmpdir } from 'os';
import { scaffoldCommand } from './scaffold';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';


vi.mock('inquirer');
vi.mock('child_process', () => ({
  default: { execSync: vi.fn() },
  execSync: vi.fn(),
}));


describe(
  'CLI Init Command Integration',
  () => {
    let tempDir: string;
    let targetDir: string;

    beforeEach(
      () => {
        scaffoldCommand.exitOverride();
        tempDir = fs.mkdtempSync(path.join(tmpdir(), 'lucid-i9n-'));
        targetDir = path.join(tempDir, 'integration-app');

        vi.mocked(inquirer.prompt).mockResolvedValue({ type: 'server' });
        vi.spyOn(process, 'cwd').mockReturnValue(tempDir);

        // fallback template path resolution (dist vs source fallback)
        const originalResolve = path.resolve;
        vi.spyOn(path, 'resolve').mockImplementation((...args) => {
          if (args.includes('templates')) {
            const distTemplate = originalResolve(__dirname, '../../dist/templates/server');
            const sourceTemplate = originalResolve(__dirname, '../../templates/server');
            return fs.existsSync(distTemplate) ? distTemplate : sourceTemplate;
          }
          return originalResolve(...args);
        });
    });

    afterEach(() => {
      vi.restoreAllMocks();
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it(
      'parses CLI arguments, scaffolds app to disk, and applies AST transformations',
      async () => {
        // simulate real terminal execution: lucid init integration-app --docs off --telemetry off --test-scope unit
        await scaffoldCommand.parseAsync([
          'integration-app',
          '--docs',
          'off',
          '--telemetry',
          'off',
          '--test-scope',
          'unit',
        ], { from: 'user' });

        // validate package.json on disk
        const pkgPath = path.join(targetDir, 'package.json');
        expect(fs.existsSync(pkgPath)).toBe(true);
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        expect(pkg.name).toBe('integration-app');

        // validate docs removal (via --docs off)
        expect(pkg.dependencies?.['swagger-jsdoc']).toBeUndefined();
        expect(fs.existsSync(path.join(targetDir, 'src/config/swagger.ts'))).toBe(false);

        // validate telemetry removal (via --telemetry off)
        expect(Object.keys(pkg.dependencies || {}).some((d) => d.startsWith('@opentelemetry/'))).toBe(false);
        expect(fs.existsSync(path.join(targetDir, 'src/telemetry'))).toBe(false);

        // validate test scope pruning (via --test-scope unit)
        expect(pkg.scripts['test:unit']).toBeDefined();
        expect(pkg.scripts['test:e2e']).toBeUndefined();
        expect(fs.existsSync(path.join(targetDir, 'playwright.config.ts'))).toBe(false);

        // validate AST modifications on routes.ts
        const routesPath = path.join(targetDir, 'src/app/routes.ts');
        if (fs.existsSync(routesPath)) {
          const routesContent = fs.readFileSync(routesPath, 'utf-8');
          expect(routesContent).not.toContain('swagger-ui-express');
          expect(routesContent).not.toContain("'/docs'");
        }
    });
});