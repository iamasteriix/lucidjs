import { Command } from 'commander';
import { initCommand, } from './boilerplates';


new Command('lucid')
  .description('Create elegant experiences for everyone')
  .version('0.1.0')
  .addCommand(initCommand)
  .parse(process.argv);
