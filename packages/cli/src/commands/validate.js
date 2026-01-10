/**
 * Validate Command
 *
 * Runs validation across project files:
 * - Fountain syntax validation
 * - Markdown linting
 * - Spell checking
 */

import chalk from 'chalk';
import ora from 'ora';
import { validateFountain } from '../validators/fountain.js';
import { validateMarkdown } from '../validators/markdown.js';
import { validateSpelling } from '../validators/spelling.js';

export async function validateCommand(options) {
  console.log(chalk.blue.bold('\n  WTFB Validation\n'));

  const results = {
    fountain: null,
    markdown: null,
    spelling: null,
  };

  let hasErrors = false;

  // Determine which validators to run
  const runAll = !options.fountain && !options.markdown && !options.spelling;

  // Fountain validation
  if (runAll || options.fountain) {
    const spinner = ora('Validating Fountain files...').start();
    try {
      results.fountain = await validateFountain(options.fix);
      if (results.fountain.errors > 0) {
        spinner.fail(`Fountain: ${results.fountain.errors} error(s)`);
        hasErrors = true;
      } else if (results.fountain.files === 0) {
        spinner.info('Fountain: No .fountain files found');
      } else {
        spinner.succeed(`Fountain: ${results.fountain.files} file(s) valid`);
      }
    } catch (err) {
      spinner.fail(`Fountain: ${err.message}`);
      hasErrors = true;
    }
  }

  // Markdown validation
  if (runAll || options.markdown) {
    const spinner = ora('Validating Markdown files...').start();
    try {
      results.markdown = await validateMarkdown(options.fix);
      if (results.markdown.errors > 0) {
        spinner.fail(`Markdown: ${results.markdown.errors} error(s)`);
        hasErrors = true;
      } else {
        spinner.succeed(`Markdown: ${results.markdown.files} file(s) valid`);
      }
    } catch (err) {
      spinner.fail(`Markdown: ${err.message}`);
      hasErrors = true;
    }
  }

  // Spell checking
  if (runAll || options.spelling) {
    const spinner = ora('Running spell check...').start();
    try {
      results.spelling = await validateSpelling();
      if (results.spelling.errors > 0) {
        spinner.fail(`Spelling: ${results.spelling.errors} issue(s)`);
        hasErrors = true;
      } else {
        spinner.succeed(`Spelling: ${results.spelling.files} file(s) checked`);
      }
    } catch (err) {
      spinner.fail(`Spelling: ${err.message}`);
      hasErrors = true;
    }
  }

  // Summary
  console.log('');
  if (hasErrors) {
    console.log(chalk.red.bold('  Validation failed.\n'));
    process.exit(1);
  } else {
    console.log(chalk.green.bold('  All validations passed.\n'));
  }

  return results;
}

/**
 * Pre-flight validation for exports
 * Returns true if validation passes, false otherwise
 */
export async function preflightValidation() {
  const spinner = ora('Running pre-flight validation...').start();

  try {
    const fountain = await validateFountain(false);

    if (fountain.errors > 0) {
      spinner.fail('Pre-flight validation failed');
      console.log(chalk.yellow('\n  Fix validation errors before exporting.\n'));
      return false;
    }

    spinner.succeed('Pre-flight validation passed');
    return true;
  } catch (err) {
    spinner.fail(`Pre-flight validation error: ${err.message}`);
    return false;
  }
}
