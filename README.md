# WTFB Packages

**Monorepo for the Words To Film By package ecosystem**

[![npm version](https://img.shields.io/npm/v/@wtfb/cli.svg)](https://www.npmjs.com/package/@wtfb/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@wtfb/cli](packages/cli) | 1.0.3 | CLI tools for validation, export, and project init |

---

## Quick Start

### Install the CLI globally

```bash
npm install -g @wtfb/cli
```

### Use in your project

```bash
# Navigate to your WTFB project
cd my-screenplay

# Validate all files
wtfb validate

# Export to PDF
wtfb export-pdf
```

---

## Available Commands

```bash
wtfb validate           # Validate Fountain, Markdown, spelling
wtfb export-pdf         # Export screenplay to PDF
wtfb export-fdx         # Export to Final Draft XML
wtfb export-html        # Export to HTML preview
wtfb init-readme        # Generate IMDb-style project README
wtfb info               # Show CLI information
```

---

## Development

### Setup

```bash
git clone https://github.com/bybren-llc/wtfb-packages.git
cd wtfb-packages
npm install
```

### Workspace Structure

```
wtfb-packages/
├── packages/
│   ├── cli/            # @wtfb/cli - Command line tools
│   └── core/           # @wtfb/core - Shared logic (future)
├── package.json        # Workspace root
└── .npmrc              # npm configuration
```

### Running locally

```bash
# Link CLI for local development
cd packages/cli
npm link

# Now use `wtfb` anywhere
wtfb validate
```

### Publishing

```bash
# From packages/cli
npm publish --access public
```

---

## Architecture

This monorepo uses **npm workspaces** for package management:

- **Shared dependencies** are hoisted to the root
- **Package-specific dependencies** stay in each package
- **Scoped packages** (`@wtfb/*`) ensure namespace consistency

### Strategy Pattern (Exporters)

Export formats use the Strategy Pattern for extensibility:

```
BaseExporter (abstract)
├── PdfExporter
├── FdxExporter
└── HtmlExporter
```

Adding new formats requires only implementing the `generate()` method.

---

## Related Projects

- [story-systems-template](https://github.com/bybren-llc/story-systems-template) - Project template with multi-AI harness
- [wtfb-claude-marketplace](https://github.com/bybren-llc/wtfb-claude-marketplace) - Claude Code plugins

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Words To Film By</strong><br>
  <a href="https://github.com/sponsors/bybren-llc">Sponsor</a> •
  <a href="https://github.com/bybren-llc/wtfb-packages/issues">Issues</a>
</p>
