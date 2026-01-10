/**
 * Export Command
 *
 * Exports Fountain screenplays to various formats:
 * - PDF (industry-standard screenplay format)
 * - FDX (Final Draft XML)
 * - HTML (web preview)
 *
 * Uses Strategy Pattern for extensible format support.
 */

import chalk from 'chalk';
import ora from 'ora';
import { preflightValidation } from './validate.js';
import { PdfExporter } from '../exporters/pdf.js';
import { FdxExporter } from '../exporters/fdx.js';
import { HtmlExporter } from '../exporters/html.js';
import { findFountainFile } from '../utils/files.js';

// Strategy Pattern: Map format to exporter
const exporters = {
  pdf: PdfExporter,
  fdx: FdxExporter,
  html: HtmlExporter,
};

export async function exportCommand(format, file, options) {
  console.log(chalk.blue.bold(`\n  WTFB Export (${format.toUpperCase()})\n`));

  // Find the fountain file
  const fountainFile = file || await findFountainFile();

  if (!fountainFile) {
    console.log(chalk.red('  No .fountain file found.\n'));
    console.log('  Usage: wtfb export-pdf [file.fountain]\n');
    process.exit(1);
  }

  console.log(chalk.gray(`  Source: ${fountainFile}\n`));

  // Pre-flight validation (unless skipped)
  if (options.validate !== false) {
    const valid = await preflightValidation();
    if (!valid) {
      console.log(chalk.yellow('  Use --no-validate to skip validation.\n'));
      process.exit(1);
    }
    console.log('');
  }

  // Get the appropriate exporter
  const ExporterClass = exporters[format];

  if (!ExporterClass) {
    console.log(chalk.red(`  Unknown export format: ${format}\n`));
    console.log('  Supported formats: pdf, fdx, html\n');
    process.exit(1);
  }

  // Run the export
  const spinner = ora(`Exporting to ${format.toUpperCase()}...`).start();

  try {
    const exporter = new ExporterClass();
    const outputPath = await exporter.export(fountainFile, options.output);

    spinner.succeed(`Exported: ${outputPath}`);
    console.log('');
  } catch (err) {
    spinner.fail(`Export failed: ${err.message}`);
    console.log('');
    process.exit(1);
  }
}
