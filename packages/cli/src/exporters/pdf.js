/**
 * PDF Exporter
 *
 * Exports Fountain screenplay to industry-standard PDF format.
 * Uses afterwriting for professional screenplay formatting.
 */

import { execSync } from 'child_process';
import { BaseExporter } from './base.js';

export class PdfExporter extends BaseExporter {
  constructor() {
    super('pdf', 'pdf');
  }

  async export(inputPath, outputPath) {
    const output = outputPath || this.getDefaultOutputPath(inputPath);

    // Use afterwriting CLI for professional PDF output
    try {
      execSync(`npx afterwriting --source "${inputPath}" --pdf "${output}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      // afterwriting may output warnings but still succeed
      // Check if the file was created
      const fs = await import('fs/promises');
      try {
        await fs.access(output);
      } catch {
        throw new Error(`PDF export failed: ${err.message}`);
      }
    }

    return output;
  }

  async generate(parsed, rawContent) {
    // Not used - afterwriting handles everything
    return null;
  }
}
