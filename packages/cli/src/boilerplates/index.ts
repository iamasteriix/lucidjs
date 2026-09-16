import { Command, Option } from 'commander';
import { scaffoldServer } from './server';
import path from 'path';
import inquirer from 'inquirer';
import fs from 'fs';


export const initCommand = new Command('init')
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
    new Option('--telemetry <mode>', 'include observability with opentelemetry')
      .choices(['on', 'off'])
      .default('on')
  )
  .action(async (dirArg, opts) => {
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
    const boilerplateDir = path.resolve(__dirname, 'boilerplates', type);
    fs.cpSync(boilerplateDir, targetDir, { recursive: true, });
    
    if (type === 'server') scaffoldServer(dirArg, opts, targetDir);
  });