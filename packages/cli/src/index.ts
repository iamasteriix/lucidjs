import { Command } from 'commander';
import { scaffoldCommand } from './scaffold/scaffold';


new Command('lucid')
  .description('Create elegant experiences for everyone')
  .version('0.1.0')
  .addCommand(scaffoldCommand)
  .parse(process.argv);
