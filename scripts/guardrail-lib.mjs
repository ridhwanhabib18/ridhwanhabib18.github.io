// Confidentiality guardrail rules (see PRD section 12). Shared by the build lint and the tests.
// The internal code-name blocklist is deliberately NOT in this file: it is loaded from the
// GUARDRAIL_BLOCKLIST environment variable (comma-separated) or from blocklist.local.txt,
// so a public repository never contains the names it is trying to keep out.

import { existsSync, readFileSync } from 'node:fs';

const PATTERNS = [
  { id: 'currency', re: /\b(USD|IDR|EUR)\b|US\$|Rp\.?\s?\d|\$\s?\d/i, why: 'currency figure' },
  { id: 'hours', re: /\b\d[\d.,]*\s*(man-?hours?|manhours?|hours?|hrs?|jam)\b/i, why: 'absolute hour count' },
  { id: 'thousands-of-hours', re: /\b(thousands?|ribuan|hundreds?|ratusan)\s+of\s+man-?hours?\b/i, why: 'absolute hour count' },
];

export function loadBlocklist(root = process.cwd()) {
  const fromEnv = (process.env.GUARDRAIL_BLOCKLIST ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const file = `${root}/blocklist.local.txt`;
  const fromFile = existsSync(file)
    ? readFileSync(file, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'))
    : [];
  return [...new Set([...fromEnv, ...fromFile])];
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function findViolations(text, blocklist = []) {
  const out = [];
  for (const { id, re, why } of PATTERNS) {
    const m = text.match(re);
    if (m) out.push({ rule: id, why, match: m[0] });
  }
  for (const term of blocklist) {
    const re = new RegExp(`(^|[^A-Za-z0-9])${escape(term)}([^A-Za-z0-9]|$)`);
    if (re.test(text)) out.push({ rule: 'code-name', why: 'internal code name', match: '[blocklisted term]' });
  }
  return out;
}
