import type { CliOptions } from './types';
import { Command, Option, } from 'commander';
import { Project, SyntaxKind } from 'ts-morph';
import { logger } from '@/config';
import child_process from 'child_process';
import path from 'path';
import inquirer from 'inquirer';
import fs from 'fs';


/**
 * Registers the init/create-app command
 */
export const scaffoldCommand = new Command('init')
  .description('Initialize a new Lucid.js app')
  .argument('[dir]', 'target directory', 'server-app')
  .addOption(
    new Option('--tests <mode>', 'include test suite')
      .choices(['on', 'off'])
      .default('on')
  )
  .addOption(
    new Option('--test-scope <kinds...>', 'specify test scopes')
      .choices(['unit', 'i9n', 'e2e'])
      .default(['unit', 'i9n', 'e2e'])
  )
  .addOption(
    new Option('--docs <mode>', 'include swagger docs')
      .choices(['on', 'off'])
      .default('on')
  )
  .addOption(
    new Option('--telemetry <mode>', 'include opentelemetry tracing')
      .choices(['on', 'off'])
      .default('on')
  )
  .action(async (dirArg, opts) => {
    const project = new Project();
    await executeProgram(dirArg, opts, project);
  });


export const executeProgram = async (
  dirArg: string = 'server-app',
  opts: CliOptions,
  project: Project
) => {
  // get target directory for default project name
  const targetDir = path.resolve(process.cwd(), dirArg);

  // specify platform
  const { type, } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select platform framework',
      choices: ['server'],
      default: 'server',
    },
  ]);
  const templateDir = path.resolve(__dirname, 'templates', type);
  fs.cpSync(templateDir, targetDir, { recursive: true, });
  
  // parse consumer package to facilitate editing
  const pkgPath = path.resolve(targetDir, 'package.json');
  const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
  const pkg = JSON.parse(pkgContent);
  pkg.name = path.basename(targetDir);  // rename package

  // handle consumer options
  handleTestOptions(opts, targetDir, pkg);
  handleDocs(opts, targetDir, project, pkg);
  handleTelemetry(opts, targetDir, pkg);
  
  // overwrite default package.json
  const pkgSerialized = JSON.stringify(pkg, null, 2);
  fs.writeFileSync(pkgPath, pkgSerialized, 'utf-8');

  // install dependencies
  logger.info('Installing dependencies...');
  child_process.execSync('npm install', {
    cwd: targetDir,
    stdio: 'inherit',
  });

  logger.info(`\nWelcome to the playground! Next steps:\n  cd ${dirArg}\n  npm run dev`);
}


/**
 * Handle tests preferences
 */
const handleTestOptions = (
  opts: CliOptions,
  targetDir: string,
  pkg: Record<string, any>,
) => {
  // strip out all tests
  if (opts.tests === 'off') {
    // strip all tests entirely
    const testFiles = fs.globSync('src/**/*.test.ts', { cwd: targetDir, });
    for (const file of testFiles) {
      const filePath = path.resolve(targetDir, file);
      fs.rmSync(filePath, { force: true });
    }

    // clean up test dependencies and scripts
    delete pkg.scripts['test:unit'];
    delete pkg.scripts['test:i9n'];
    delete pkg.scripts['test:e2e'];
    delete pkg.devDependencies['vitest'];
    delete pkg.devDependencies['@playwright/test'];
    delete pkg.devDependencies['supertest'];
    delete pkg.devDependencies['@types/supertest'];
  }
  
  // test scopes specified
  else if (opts.testScope) {
    // prune unselected tests
    const specifiedTestScopes = opts.testScope ?? ['unit', 'i9n', 'e2e'];
    const excludedTestScopes = ['unit', 'i9n', 'e2e'].filter(scope => !specifiedTestScopes.includes(scope));
    for (const scope of excludedTestScopes) {
      const excludedTestFiles = fs.globSync(`src/**/*.${scope}.test.ts`, { cwd: targetDir, });
      for (const file of excludedTestFiles) {
        const filePath = path.resolve(targetDir, file);
        fs.rmSync(filePath, { force: true });
      }
    }

    // prune specific test scripts based on excluded scopes
    if (!specifiedTestScopes.includes('unit')) delete pkg.scripts['test:unit'];
    if (!specifiedTestScopes.includes('i9n')) delete pkg.scripts['test:i9n'];
    if (!specifiedTestScopes.includes('e2e')) {
      fs.rmSync(path.resolve(targetDir, 'playwright.config.ts'), { force: true, }); // remove playwright.config
      delete pkg.scripts['test:e2e'];
      delete pkg.devDependencies['@playwright/test'];
    }

    // remove vitest if neither unit nor i9n are selected
    if (!specifiedTestScopes.includes('unit') && !specifiedTestScopes.includes('i9n')) {
      fs.rmSync(path.resolve(targetDir, 'vitest.config.ts'), { force: true, }); // remove vitest.config
      delete pkg.devDependencies['vitest'];
      delete pkg.devDependencies['supertest'];
      delete pkg.devDependencies['@types/supertest'];
    }
  }
}


/**
 * Handle API docs preferences
 */
const handleDocs = (
  opts: CliOptions,
  targetDir: string,
  project: Project,
  pkg: Record<string, any>,
) => {
  // remove docs
  if (opts.docs === 'off') {
    // delete route
    const routesFilePath = path.resolve(targetDir, 'src/app/routes.ts');
    const routesFile = project.addSourceFileAtPath(routesFilePath);
    routesFile?.getDescendantsOfKind(SyntaxKind.ExpressionStatement)
      .forEach(statement => {
        if (statement.getText().includes('swaggerUi.serve')) statement.remove();
      });
    routesFile.getImportDeclarations()
      .forEach(statement => {
        if (statement.getModuleSpecifierValue().includes('swagger')) statement.remove();
      });
    routesFile.saveSync();

    // remove spec files
    const docFiles = fs.globSync('src/**/*.docs.yml', { cwd: targetDir });
    for (const file of docFiles) {
      const filePath = path.resolve(targetDir, file);
      fs.rmSync(filePath, { force: true });
    }

    // remove swagger config
    const docConfigPath = path.resolve(targetDir, 'src/config/swagger.ts');
    fs.rmSync(docConfigPath, { force: true, });

    // clean up docs dependencies
    delete pkg.dependencies['swagger-jsdoc'];
    delete pkg.dependencies['swagger-ui-express'];
    delete pkg.devDependencies['@types/swagger-jsdoc'];
    delete pkg.devDependencies['@types/swagger-ui-express'];
  }
}


/**
 * Handle server observability preferences
 */
const handleTelemetry = (
  opts: CliOptions,
  targetDir: string,
  pkg: Record<string, any>,
) => {
  // remove telemetry
  if (opts.telemetry === 'off') {
    const telemetryDir = path.resolve(targetDir, 'src/telemetry/');
    fs.rmSync(telemetryDir, { recursive: true, force: true, });

    // update scripts to remove tracing ability
    const pkgScripts: [string, string][] = Object.entries(pkg.scripts || {});
    for (const [key, val] of pkgScripts) pkg.scripts[key] = val.replace(/--import\s+\S*telemetry\S*/g, '').replace(/\s+/g, ' ').trim();

    // delete telemetry dependencies
    const deps = [pkg.dependencies, pkg.devDependencies];
    for (const dep of deps) {
      Object.keys(dep).forEach(item => {
        if (item.startsWith('@opentelemetry/')) delete dep[item];
      });
    }
  }
}
