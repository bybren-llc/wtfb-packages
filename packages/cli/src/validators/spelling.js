/**
 * Spelling Validator
 *
 * Runs spell checking using cspell
 */

import { execSync } from 'child_process';
import { glob } from 'glob';

export async function validateSpelling() {
  const files = await glob('**/*.{md,fountain,txt}', {
    ignore: ['node_modules/**', 'exports/**'],
  });

  if (files.length === 0) {
    return { files: 0, errors: 0 };
  }

  try {
    const cmd = `npx cspell "**/*.{md,fountain,txt}" --no-progress`;

    execSync(cmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return { files: files.length, errors: 0 };
  } catch (err) {
    // cspell returns non-zero on spelling errors
    const output = err.stdout || err.stderr || '';

    // Count "Unknown word" occurrences
    const matches = output.match(/Unknown word/gi) || [];
    const errorCount = matches.length;

    if (output.trim()) {
      // Show only the errors, not the full output
      const lines = output.split('\n').filter((line) =>
        line.includes('Unknown word') || line.includes('.fountain') || line.includes('.md')
      );
      if (lines.length > 0) {
        console.log(lines.slice(0, 10).join('\n'));
        if (lines.length > 10) {
          console.log(`  ... and ${lines.length - 10} more`);
        }
      }
    }

    return { files: files.length, errors: errorCount || 1 };
  }
}
