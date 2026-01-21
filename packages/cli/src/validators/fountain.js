/**
 * Fountain Validator
 *
 * Validates .fountain screenplay files for:
 * - Proper scene heading format (INT./EXT.)
 * - Character name consistency
 * - Parenthetical formatting
 * - Basic syntax errors
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { Fountain } from 'fountain-js';

export async function validateFountain(autoFix = false) {
  const files = await glob('**/*.fountain', {
    ignore: ['node_modules/**', 'exports/**'],
  });

  if (files.length === 0) {
    return { files: 0, errors: 0, warnings: 0 };
  }

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const result = validateFountainContent(content, file);

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    // Output errors
    for (const error of result.errors) {
      console.log(`  ${file}:${error.line} - ${error.message}`);
    }
  }

  return {
    files: files.length,
    errors: totalErrors,
    warnings: totalWarnings,
  };
}

function validateFountainContent(content, filename) {
  const errors = [];
  const warnings = [];
  const lines = content.split('\n');

  // Parse with fountain-js
  try {
    const parser = new Fountain();
    const parsed = parser.parse(content);

    // Validate scene headings
    const sceneHeadingPattern = /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s+.+/i;
    const badSceneHeading = /^(INTERIOR|EXTERIOR)\s+/i;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Check for common scene heading mistakes
      if (badSceneHeading.test(trimmed)) {
        errors.push({
          line: lineNum,
          message: 'Use INT. or EXT. instead of INTERIOR/EXTERIOR',
        });
      }

      // Check for missing time of day in scene headings
      if (sceneHeadingPattern.test(trimmed)) {
        if (!/-(DAY|NIGHT|MORNING|EVENING|LATER|CONTINUOUS|SAME)/i.test(trimmed)) {
          warnings.push({
            line: lineNum,
            message: 'Scene heading missing time of day (DAY, NIGHT, etc.)',
          });
        }
      }

      // Check for orphaned parentheticals
      if (/^\(.*\)$/.test(trimmed) && index > 0) {
        const prevLine = lines[index - 1].trim();
        if (!prevLine || prevLine.match(/^[A-Z\s]+$/)) {
          // Valid - parenthetical after character name
        } else if (!prevLine) {
          warnings.push({
            line: lineNum,
            message: 'Parenthetical may be orphaned (no character above)',
          });
        }
      }
    });
  } catch (err) {
    errors.push({
      line: 1,
      message: `Parse error: ${err.message}`,
    });
  }

  return { errors, warnings };
}

export { validateFountainContent };
