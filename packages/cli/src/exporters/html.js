/**
 * HTML Exporter
 *
 * Exports Fountain screenplay to HTML for web preview.
 */

import { BaseExporter } from './base.js';

export class HtmlExporter extends BaseExporter {
  constructor() {
    super('html', 'html');
  }

  async generate(parsed, rawContent) {
    const title = parsed.title?.text || 'Untitled';
    const author = parsed.author?.text || '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div class="screenplay">
    ${this.renderTitlePage(parsed)}
    ${this.renderContent(parsed.tokens || [])}
  </div>
</body>
</html>`;

    return html;
  }

  getStyles() {
    return `
    * { box-sizing: border-box; }
    body {
      font-family: 'Courier Prime', 'Courier New', monospace;
      font-size: 12pt;
      line-height: 1.5;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 1in;
      background: #fff;
    }
    .screenplay { max-width: 6in; margin: 0 auto; }
    .title-page {
      text-align: center;
      page-break-after: always;
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .title-page h1 { font-size: 24pt; margin-bottom: 2em; }
    .title-page .author { font-size: 12pt; }
    .scene-heading {
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 2em;
    }
    .action { margin: 1em 0; }
    .character {
      text-transform: uppercase;
      margin-left: 2in;
      margin-top: 1em;
    }
    .dialogue {
      margin-left: 1in;
      margin-right: 1.5in;
    }
    .parenthetical {
      margin-left: 1.5in;
      margin-right: 2in;
      font-style: italic;
    }
    .transition {
      text-align: right;
      text-transform: uppercase;
      margin: 1em 0;
    }
    .centered { text-align: center; }
    @media print {
      body { padding: 0; }
      .title-page { page-break-after: always; }
    }
    `;
  }

  renderTitlePage(parsed) {
    const title = parsed.title?.text || 'Untitled';
    const author = parsed.author?.text || '';
    const credit = parsed.credit?.text || 'Written by';

    return `
    <div class="title-page">
      <h1>${this.escapeHtml(title)}</h1>
      <p class="credit">${this.escapeHtml(credit)}</p>
      <p class="author">${this.escapeHtml(author)}</p>
    </div>`;
  }

  renderContent(tokens) {
    return tokens.map((token) => this.renderToken(token)).join('\n');
  }

  renderToken(token) {
    const text = this.escapeHtml(token.text || '');

    switch (token.type) {
      case 'scene_heading':
        return `<p class="scene-heading">${text}</p>`;
      case 'action':
        return `<p class="action">${text}</p>`;
      case 'character':
        return `<p class="character">${text}</p>`;
      case 'dialogue':
        return `<p class="dialogue">${text}</p>`;
      case 'parenthetical':
        return `<p class="parenthetical">${text}</p>`;
      case 'transition':
        return `<p class="transition">${text}</p>`;
      case 'centered':
        return `<p class="centered">${text}</p>`;
      default:
        return text ? `<p>${text}</p>` : '';
    }
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
