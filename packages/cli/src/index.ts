import { Command } from 'commander';
import { createTemplate } from './templates';
import { registerFonts, } from './fonts';


const program = new Command();


program
  .name('lucidjs')
  .description('Create elegant experiences for everyone')
  .version('0.1.0');

createTemplate(program);
registerFonts(program);

program.parse(process.argv);
