import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const copierArgs = ['copy', 'templates/work', 'content/work', ...process.argv.slice(2)];

/** Copier is a Python tool; use whichever launcher is available. */
const launchers = [
  ['copier', []],
  ['uvx', ['copier']],
  ['pipx', ['run', 'copier']],
];

const has = (cmd) => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0;

const found = launchers.find(([cmd]) => has(cmd));
if (!found) {
  console.error('Copier is required to add new work but was not found.');
  console.error('Install it with one of:');
  console.error('  pipx install copier');
  console.error('  brew install copier');
  console.error('  uv tool install copier');
  process.exit(1);
}

const [cmd, prefix] = found;
const result = spawnSync(cmd, [...prefix, ...copierArgs], { cwd: siteRoot, stdio: 'inherit' });
process.exit(result.status ?? 1);
