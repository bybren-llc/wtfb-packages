# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WTFB Packages is a monorepo containing tools for the Words To Film By creative toolkit. Currently contains `@wtfb/cli` - a validation and export tool for screenplays and creative projects.

## Commands

```bash
# Install dependencies (from root)
npm install

# Build/Test/Lint all packages (from root)
npm run build
npm run test
npm run lint

# Clean all packages (removes dist/ and node_modules/)
npm run clean

# Run single package tests
cd packages/cli && npm test

# Local development - link CLI globally
cd packages/cli && npm link
wtfb validate --help
npm unlink -g @wtfb/cli  # when done
```

## Architecture

### Monorepo Structure

- npm workspaces at root level
- Packages under `packages/` directory, scoped as `@wtfb/*`
- Pure ESM JavaScript (no TypeScript, no build step required)
- Node.js 18+ required

### @wtfb/cli Package

**Entry point**: `packages/cli/bin/index.js` (Commander.js CLI)

**Module organization**:
```
packages/cli/src/
├── commands/       # CLI command handlers
├── validators/     # Format-specific validators (fountain, markdown, spelling)
├── exporters/      # Format-specific exporters (pdf, fdx, html)
└── utils/          # Shared utilities (file discovery)
```

**Key patterns**:

1. **Strategy Pattern for Exporters** - All exporters extend `BaseExporter` (in `exporters/base.js`):
   - `BaseExporter` handles file I/O, output paths, directory creation
   - Subclasses implement `generate()` method for format-specific logic
   - New formats: create exporter class, add to factory map in `commands/export.js`

2. **External CLI Wrapping** - Validators/exporters delegate to external tools via `execSync`:
   - PDF export: `afterwriting` CLI
   - Markdown validation: `markdownlint-cli2`
   - Spell checking: `cspell`

3. **Pre-flight Validation** - Export commands validate input before conversion (skip with `--no-validate`)

### Testing

Uses Node.js native test runner (`node --test`). Test files in `packages/cli/test/`.

## CLI Usage

```bash
# Validate files
wtfb validate <files...> [--type fountain|markdown|spelling]

# Export screenplay
wtfb export <file> --format pdf|fdx|html [--output path] [--no-validate]
```

## Publishing

See `docs/PUBLISHING.md` for npm publish workflow. Packages are public under `@wtfb` scope.
