import { test, describe } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, '..', 'bin', 'index.js');

/**
 * Helper to run CLI commands
 */
function runCli(args = '') {
  return execSync(`node ${CLI_PATH} ${args}`, {
    encoding: 'utf-8',
    cwd: join(__dirname, '..'),
  });
}

describe('@wtfb/cli', () => {
  test('--version outputs version number', () => {
    const output = runCli('--version');
    assert.match(output.trim(), /^\d+\.\d+\.\d+$/, 'Should output semver version');
  });

  test('--help shows usage information', () => {
    const output = runCli('--help');
    assert.ok(output.includes('WTFB CLI'), 'Should include CLI name');
    assert.ok(output.includes('validate'), 'Should include validate command');
    assert.ok(output.includes('export-pdf'), 'Should include export-pdf command');
  });

  test('info command shows CLI information', () => {
    const output = runCli('info');
    assert.ok(output.includes('WTFB CLI'), 'Should include CLI name');
    assert.ok(output.includes('bybren-llc/wtfb-packages'), 'Should include repo URL');
  });

  test('validate --help shows validation options', () => {
    const output = runCli('validate --help');
    assert.ok(output.includes('--fountain'), 'Should include fountain option');
    assert.ok(output.includes('--markdown'), 'Should include markdown option');
    assert.ok(output.includes('--spelling'), 'Should include spelling option');
  });

  test('export-pdf --help shows export options', () => {
    const output = runCli('export-pdf --help');
    assert.ok(output.includes('--output'), 'Should include output option');
    assert.ok(output.includes('--no-validate'), 'Should include no-validate option');
  });

  test('init-readme --help shows init-readme options', () => {
    const output = runCli('init-readme --help');
    assert.ok(output.includes('--title'), 'Should include title option');
    assert.ok(output.includes('--type'), 'Should include type option');
    assert.ok(output.includes('--force'), 'Should include force option');
    assert.ok(output.includes('--dry-run'), 'Should include dry-run option');
  });

  test('init-readme --dry-run generates README preview', () => {
    // Create temp directory for test
    const tmpDir = fs.mkdtempSync(join(os.tmpdir(), 'wtfb-test-'));
    try {
      const output = execSync(`node ${CLI_PATH} init-readme --title "Test Film" --type screenplay --dry-run`, {
        encoding: 'utf-8',
        cwd: tmpDir,
      });
      assert.ok(output.includes('DRY RUN'), 'Should indicate dry run');
      assert.ok(output.includes('Test Film'), 'Should include title');
      // Verify no README was created
      assert.ok(!fs.existsSync(join(tmpDir, 'README.md')), 'Should not create README in dry-run');
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });

  test('init-readme creates README with title and type', () => {
    const tmpDir = fs.mkdtempSync(join(os.tmpdir(), 'wtfb-test-'));
    try {
      execSync(`node ${CLI_PATH} init-readme --title "My Screenplay" --type screenplay`, {
        encoding: 'utf-8',
        cwd: tmpDir,
      });
      const readme = fs.readFileSync(join(tmpDir, 'README.md'), 'utf-8');
      assert.ok(readme.includes('# My Screenplay'), 'Should include title');
      assert.ok(readme.includes('**Screenplay**'), 'Should include type');
      assert.ok(!readme.includes('wtfb:template-readme'), 'Should remove template marker');
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  });
});
