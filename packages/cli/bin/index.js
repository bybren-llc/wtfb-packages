#!/usr/bin/env node

/**
 * WTFB CLI - Validation and export tools for creative projects
 *
 * Usage:
 *   wtfb validate [options]     Validate project files
 *   wtfb export-pdf [file]      Export to PDF
 *   wtfb export-fdx [file]      Export to Final Draft XML
 *   wtfb export-html [file]     Export to HTML
 *   wtfb init [name]            Initialize a new project
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import { validateCommand } from '../src/commands/validate.js';
import { exportCommand } from '../src/commands/export.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program
  .name('wtfb')
  .description('WTFB CLI - Validation and export tools for creative projects')
  .version(pkg.version);

// Validate command
program
  .command('validate')
  .description('Validate project files (Fountain, Markdown, spelling)')
  .option('-f, --fountain', 'Validate Fountain files only')
  .option('-m, --markdown', 'Validate Markdown files only')
  .option('-s, --spelling', 'Run spell check only')
  .option('--fix', 'Auto-fix issues where possible')
  .action(validateCommand);

// Export commands
program
  .command('export-pdf [file]')
  .description('Export Fountain screenplay to PDF')
  .option('-o, --output <path>', 'Output file path')
  .option('--no-validate', 'Skip pre-flight validation')
  .action((file, options) => exportCommand('pdf', file, options));

program
  .command('export-fdx [file]')
  .description('Export Fountain screenplay to Final Draft XML')
  .option('-o, --output <path>', 'Output file path')
  .option('--no-validate', 'Skip pre-flight validation')
  .action((file, options) => exportCommand('fdx', file, options));

program
  .command('export-html [file]')
  .description('Export Fountain screenplay to HTML')
  .option('-o, --output <path>', 'Output file path')
  .option('--no-validate', 'Skip pre-flight validation')
  .action((file, options) => exportCommand('html', file, options));

// Info command
program
  .command('info')
  .description('Show project information')
  .action(() => {
    console.log(chalk.blue.bold(`\n  WTFB CLI v${pkg.version}\n`));
    console.log('  Validation and export tools for creative projects.');
    console.log('  Part of the Words To Film By ecosystem.\n');
    console.log(chalk.gray('  https://github.com/bybren-llc/wtfb-packages\n'));
  });

program.parse();
