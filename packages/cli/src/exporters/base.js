/**
 * Base Exporter
 *
 * Abstract base class for all exporters.
 * Implements Strategy Pattern for extensible format support.
 */

import fs from 'fs/promises';
import path from 'path';
import fountain from 'fountain-js';

export class BaseExporter {
  constructor(format, extension) {
    this.format = format;
    this.extension = extension;
  }

  /**
   * Export a Fountain file to the target format
   * @param {string} inputPath - Path to .fountain file
   * @param {string} outputPath - Optional output path
   * @returns {Promise<string>} - Path to exported file
   */
  async export(inputPath, outputPath) {
    // Read and parse the Fountain file
    const content = await fs.readFile(inputPath, 'utf-8');
    const parsed = fountain.parse(content);

    // Determine output path
    const output = outputPath || this.getDefaultOutputPath(inputPath);

    // Ensure exports directory exists
    const dir = path.dirname(output);
    await fs.mkdir(dir, { recursive: true });

    // Generate the export (implemented by subclasses)
    const exportedContent = await this.generate(parsed, content);

    // Write the file
    await fs.writeFile(output, exportedContent);

    return output;
  }

  /**
   * Generate the exported content
   * Must be implemented by subclasses
   */
  async generate(parsed, rawContent) {
    throw new Error('generate() must be implemented by subclass');
  }

  /**
   * Get default output path based on input file
   */
  getDefaultOutputPath(inputPath) {
    const basename = path.basename(inputPath, '.fountain');
    return path.join('exports', this.format, `${basename}.${this.extension}`);
  }
}
