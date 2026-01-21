# @wtfb/cli

**Validation and export tools for creative projects**

[![npm version](https://img.shields.io/npm/v/@wtfb/cli.svg)](https://www.npmjs.com/package/@wtfb/cli)

Part of the [Words To Film By](https://github.com/bybren-llc/story-systems-template) ecosystem.

---

## Installation

```bash
npm install -g @wtfb/cli
```

## Usage

```bash
# Validate all project files
wtfb validate

# Validate specific types
wtfb validate --fountain    # Fountain files only
wtfb validate --markdown    # Markdown files only
wtfb validate --spelling    # Spell check only

# Export screenplay to PDF
wtfb export-pdf

# Export with specific output path
wtfb export-pdf my-script.fountain -o exports/final.pdf

# Export to Final Draft XML
wtfb export-fdx

# Export to HTML preview
wtfb export-html

# Skip pre-flight validation
wtfb export-pdf --no-validate

# Initialize project README
wtfb init-readme --title "My Project" --type screenplay

# Show CLI info
wtfb info
```

---

## Commands

### `wtfb validate`

Runs validation across your project files:

| Flag | Description |
|------|-------------|
| `-f, --fountain` | Validate Fountain files only |
| `-m, --markdown` | Validate Markdown files only |
| `-s, --spelling` | Run spell check only |
| `--fix` | Auto-fix issues where possible |

### `wtfb export-pdf [file]`

Export Fountain screenplay to industry-standard PDF.

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Custom output path |
| `--no-validate` | Skip pre-flight validation |

### `wtfb export-fdx [file]`

Export Fountain screenplay to Final Draft XML format.

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Custom output path |
| `--no-validate` | Skip pre-flight validation |

### `wtfb export-html [file]`

Export Fountain screenplay to HTML for web preview.

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Custom output path |
| `--no-validate` | Skip pre-flight validation |

### `wtfb init-readme`

Initialize project README from IMDb-style template.

| Option | Description |
|--------|-------------|
| `--title <title>` | Override project title |
| `--type <type>` | Project type: `screenplay`, `novel`, or `film-production` |
| `--force` | Overwrite even if README is customized |
| `--dry-run` | Show what would be generated without writing |

The command reads project configuration from `.wtfb/project.json` if available, or uses the provided options.

---

## Pre-flight Validation

By default, all export commands run validation before generating output. This ensures your screenplay is error-free before export.

To skip validation:
```bash
wtfb export-pdf --no-validate
```

---

## Configuration

The CLI respects project-level configuration files:

| File | Purpose |
|------|---------|
| `cspell.json` | Spell check configuration |
| `.cspell/project-words.txt` | Custom dictionary |
| `.markdownlint-cli2.yaml` | Markdown lint rules |

---

## Output Directories

By default, exports are saved to:

```
exports/
├── pdf/     # PDF files
├── fdx/     # Final Draft XML
└── html/    # HTML previews
```

---

## Requirements

- Node.js 18+
- For PDF export: `afterwriting` (installed automatically)

---

## Related

- [Story Systems Template](https://github.com/bybren-llc/story-systems-template) - Full project template
- [Fountain Syntax](https://fountain.io/syntax) - Screenplay format reference

---

## License

MIT License - see [LICENSE](../../LICENSE) for details.

---

<p align="center">
  <strong>Words To Film By</strong><br>
  <em>Your creative AI team, ready to work.</em>
</p>
