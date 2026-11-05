// Fails the build if published text breaks the confidentiality rules.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { findViolations, loadBlocklist } from './guardrail-lib.mjs';

const root = process.cwd();
const targets = ['src/content', 'src/i18n', 'index.html'];
const blocklist = loadBlocklist(root);

if (blocklist.length === 0) {
  const msg = 'guardrail: no code-name blocklist found (set GUARDRAIL_BLOCKLIST or add blocklist.local.txt). Only generic rules are checked.';
  if (process.env.CI) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(msg);
}

function* files(p) {
  const abs = join(root, p);
  if (statSync(abs).isDirectory()) {
    for (const f of readdirSync(abs)) yield* files(join(p, f));
  } else {
    yield p;
  }
}

let failed = false;
for (const t of targets) {
  for (const f of files(t)) {
    const text = readFileSync(join(root, f), 'utf8');
    text.split(/\r?\n/).forEach((line, i) => {
      for (const v of findViolations(line, blocklist)) {
        failed = true;
        console.error(`guardrail: ${f}:${i + 1} ${v.why} (${v.rule}) -> ${v.match}`);
      }
    });
  }
}

if (failed) process.exit(1);
console.log('guardrail: ok');
