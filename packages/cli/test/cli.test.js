import { test, describe } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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
});
