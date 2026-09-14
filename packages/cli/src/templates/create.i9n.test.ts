import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { tmpdir } from 'os';
import { executeProgram } from './create';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';


vi.mock('inquirer');
vi.mock('child_process', () => ({
  default: { execSync: vi.fn() },
  execSync: vi.fn(),
}));


describe(
  'createTemplate integration',
  () => {
    let tempDir: string;
    let targetDir: string;

    beforeEach(async () => {
      tempDir = fs.mkdtempSync(path.join(tmpdir(), 'lucid-test-'));
      targetDir = path.join(tempDir, 'server-test-app');

      vi.mocked(inquirer.prompt).mockResolvedValue({ type: 'server' });
      vi.spyOn(process, 'cwd').mockReturnValue(tempDir);

      const originalResolve = path.resolve;
      vi.spyOn(path, 'resolve').mockImplementation((...args) =>
        args.includes('templates')
          ? originalResolve(__dirname, '../../dist/templates/server')
          : originalResolve(...args)
      );
    });

    afterEach(async () => {
      vi.restoreAllMocks();
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it(
      'scaffolds app on disk and prunes docs and test scopes correctly',
      async () => {
        const templateRoot = path.resolve(__dirname, '../../dist/templates/server');  // explicitly point executeProgram to dist/templates/server
        expect(fs.existsSync(templateRoot)).toBe(true);

        await executeProgram('server-test-app', {
          withDocs: false,
          withTests: true,
          testScope: ['unit'],
          telemetry: 'off',
        });

        const pkgContent = fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8');
        const pkg = JSON.parse(pkgContent);

        expect(pkg.name).toBe('server-test-app');
        expect(pkg.dependencies['swagger-jsdoc']).toBeUndefined();
        expect(Object.keys(pkg.dependencies || {}).some(d => d.startsWith('@opentelemetry/'))).toBe(false);
        expect(pkg.scripts['test:unit']).toBeDefined();
        expect(pkg.scripts['test:e2e']).toBeUndefined();

        const files = fs.readdirSync(path.join(targetDir, 'src'), { recursive: true });
        expect(files.some(f => f.includes('.e2e.test.ts'))).toBe(false);
        expect(files.some(f => f.includes('.i9n.test.ts'))).toBe(false);
        expect(fs.existsSync(path.join(targetDir, 'src/telemetry'))).toBe(false);
    });
});
