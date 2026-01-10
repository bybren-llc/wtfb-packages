/**
 * FDX Exporter
 *
 * Exports Fountain screenplay to Final Draft XML format.
 */

import { BaseExporter } from './base.js';

export class FdxExporter extends BaseExporter {
  constructor() {
    super('fdx', 'fdx');
  }

  async generate(parsed, rawContent) {
    // Build FDX XML structure
    const xml = this.buildFdxXml(parsed);
    return xml;
  }

  buildFdxXml(parsed) {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No" Version="5">
  <Content>`;

    const footer = `
  </Content>
</FinalDraft>`;

    const paragraphs = this.convertTokensToFdx(parsed.tokens || []);

    return header + paragraphs + footer;
  }

  convertTokensToFdx(tokens) {
    let xml = '';

    for (const token of tokens) {
      switch (token.type) {
        case 'scene_heading':
          xml += this.createParagraph('Scene Heading', token.text);
          break;
        case 'action':
          xml += this.createParagraph('Action', token.text);
          break;
        case 'character':
          xml += this.createParagraph('Character', token.text);
          break;
        case 'dialogue':
          xml += this.createParagraph('Dialogue', token.text);
          break;
        case 'parenthetical':
          xml += this.createParagraph('Parenthetical', token.text);
          break;
        case 'transition':
          xml += this.createParagraph('Transition', token.text);
          break;
        case 'centered':
          xml += this.createParagraph('General', token.text);
          break;
        default:
          if (token.text) {
            xml += this.createParagraph('General', token.text);
          }
      }
    }

    return xml;
  }

  createParagraph(type, text) {
    const escapedText = this.escapeXml(text || '');
    return `
    <Paragraph Type="${type}">
      <Text>${escapedText}</Text>
    </Paragraph>`;
  }

  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
