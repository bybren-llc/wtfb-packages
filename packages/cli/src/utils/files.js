/**
 * File Utilities
 *
 * Helper functions for file operations
 */

import { glob } from 'glob';

/**
 * Find the main Fountain file in the current directory
 * @returns {Promise<string|null>} Path to fountain file or null
 */
export async function findFountainFile() {
  const files = await glob('*.fountain', {
    ignore: ['node_modules/**'],
  });

  if (files.length === 0) {
    // Try looking in common locations
    const altFiles = await glob('{screenplay,script,draft}/**/*.fountain', {
      ignore: ['node_modules/**'],
    });

    if (altFiles.length > 0) {
      return altFiles[0];
    }

    return null;
  }

  // If multiple files, prefer ones that look like main scripts
  const mainPatterns = [/^[a-z-]+\.fountain$/i, /script/i, /screenplay/i];

  for (const pattern of mainPatterns) {
    const match = files.find((f) => pattern.test(f));
    if (match) return match;
  }

  // Return first file found
  return files[0];
}

/**
 * Find all Fountain files in the project
 * @returns {Promise<string[]>} Array of fountain file paths
 */
export async function findAllFountainFiles() {
  return glob('**/*.fountain', {
    ignore: ['node_modules/**', 'exports/**'],
  });
}
