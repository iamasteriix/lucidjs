import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Command } from 'commander';
import { createTemplate, executeProgram } from './create';
import inquirer from 'inquirer';
import fs from 'fs';


vi.mock('fs');
vi.mock('child_process');
vi.mock('inquirer');


describe(
  'createTemplate command & execution',
  () => {
    const mockPkgJson = {
      name: '@lucidjs/server-template',
      scripts: { 'test:unit': 'vitest', 'test:e2e': 'playwright' },
      dependencies: { 'swagger-jsdoc': '1.0.0' },
      devDependencies: { vitest: '1.0.0', '@playwright/test': '1.0.0' },
    };

    beforeEach(() => {
      vi.clearAllMocks();
      vi.mocked(inquirer.prompt).mockResolvedValue({ type: 'server' });
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockPkgJson));
      vi.mocked(fs.writeFileSync).mockReturnValue(undefined);
      vi.mocked(fs.cpSync).mockReturnValue(undefined);
      vi.mocked(fs.globSync).mockReturnValue([]);
    });

    it(
      'registers the init command on the Commander instance',
      () => {
        const program = new Command();
        createTemplate(program);

        const initCmd = program.commands.find(cmd => cmd.name() === 'init');
        expect(initCmd).toBeDefined();
        expect(initCmd?.description()).toBe('Initialize a new Lucid.js app');
    });

    it(
      'prunes test scripts and packages when unit tests are excluded',
      async () => {
        await executeProgram('server-app', {
          withTests: true,
          testScope: ['e2e'],
        });

        const writtenPkg = JSON.parse(vi.mocked(fs.writeFileSync).mock.calls[0][1] as string);
        expect(writtenPkg.scripts['test:unit']).toBeUndefined();
        expect(writtenPkg.devDependencies['vitest']).toBeUndefined();
        expect(writtenPkg.scripts['test:e2e']).toBeDefined();
    });

    it(
      'prunes swagger dependencies when withDocs is false',
      async () => {
        await executeProgram('server-app', { withDocs: false, withTests: true });

        const writtenPkg = JSON.parse(vi.mocked(fs.writeFileSync).mock.calls[0][1] as string);
        expect(writtenPkg.name).toBe('server-app');
        expect(writtenPkg.dependencies['swagger-jsdoc']).toBeUndefined();
    });

    it(
      'prunes telemetry files, scripts, and dependencies when telemetry is off',
      async () => {
        vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify({
          ...mockPkgJson,
          scripts: { start: 'node --import ./dist/telemetry/index.js dist/index.js' },
          dependencies: { '@opentelemetry/sdk-node': '1.0.0' },
        }));

        await executeProgram('express-app', { telemetry: 'off' } as any);

        const writtenPkg = JSON.parse(vi.mocked(fs.writeFileSync).mock.calls[0][1] as string);
        expect(writtenPkg.dependencies['@opentelemetry/sdk-node']).toBeUndefined();
        expect(writtenPkg.scripts.start).toBe('node dist/index.js');
        expect(fs.rmSync).toHaveBeenCalledWith(
          expect.stringMatching(/src[/\\]telemetry$/),
          { recursive: true, force: true }
        );
    });
});
