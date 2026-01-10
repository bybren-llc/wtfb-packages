/**
 * Markdown Validator
 *
 * Validates Markdown files using markdownlint-cli2
 */

import { execSync } from 'child_process';
import { glob } from 'glob';

export async function validateMarkdown(autoFix = false) {
  const files = await glob('**/*.md', {
    ignore: ['node_modules/**', 'exports/**'],
  });

  if (files.length === 0) {
    return { files: 0, errors: 0 };
  }

  try {
    const fixFlag = autoFix ? '--fix' : '';
    const cmd = `npx markdownlint-cli2 "**/*.md" "#node_modules" ${fixFlag}`;

    execSync(cmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return { files: files.length, errors: 0 };
  } catch (err) {
    // markdownlint returns non-zero on errors
    const output = err.stdout || err.stderr || '';
    const errorCount = (output.match(/\n/g) || []).length;

    if (output.trim()) {
      console.log(output);
    }

    return { files: files.length, errors: errorCount || 1 };
  }
}
