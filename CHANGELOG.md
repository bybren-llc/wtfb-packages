# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-01-21

### Added
- `wtfb init-readme` command - Generate IMDb-style README from template
  - Options: `--title`, `--type`, `--force`, `--dry-run`
  - Supports project types: screenplay, novel, film-production
  - Respects customized READMEs (skips unless `--force`)
- IMDb-style README template

### Changed
- Updated Related links to point to story-systems-template repo

## [1.0.2] - 2026-01-11

### Added
- Dynamic version reading from package.json
- Smoke tests for CLI commands
- npm version badge in READMEs
- GitHub Actions CI workflow
- CHANGELOG.md

### Fixed
- `wtfb info` now shows correct version dynamically

## [1.0.1] - 2026-01-11

### Fixed
- Repository URLs corrected to bybren-llc org (repo transferred from cheddarfox)

## [1.0.0] - 2026-01-10

### Added
- Initial release of @wtfb/cli
- `wtfb validate` - Validate Fountain, Markdown, and spelling
- `wtfb export-pdf` - Export screenplay to PDF
- `wtfb export-fdx` - Export screenplay to Final Draft XML
- `wtfb export-html` - Export screenplay to HTML
- `wtfb info` - Show CLI information

[1.0.3]: https://github.com/bybren-llc/wtfb-packages/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/bybren-llc/wtfb-packages/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/bybren-llc/wtfb-packages/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bybren-llc/wtfb-packages/releases/tag/v1.0.0
