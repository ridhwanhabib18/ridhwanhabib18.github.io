import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resumeVariants } from '../content/resume';
// @ts-expect-error plain ESM helper without types
import { findViolations, loadBlocklist } from '../../scripts/guardrail-lib.mjs';

const typ = readFileSync('resume/main.typ', 'utf8');
const script = readFileSync('scripts/build-resume.mjs', 'utf8');

describe('resume source and PDF pipeline', () => {
  it('lets the variant be chosen with --input role=...', () => {
    expect(typ).toContain('sys.inputs.at("role"');
  });

  it('has a summary in the source for every variant shown on the site', () => {
    for (const v of resumeVariants) expect(typ, v.key).toMatch(new RegExp(String.raw`^\s+${v.key}: "`, 'm'));
  });

  it('compiles every variant and links the same file names the site expects', () => {
    for (const v of resumeVariants) {
      expect(v.pdf).toBe(`resume/ridhwan-habib-resume-${v.key}.pdf`);
      expect(script, v.key).toContain(`'${v.key}'`);
    }
  });

  it('keeps the resume text within the confidentiality rules', () => {
    expect(findViolations(typ, loadBlocklist())).toEqual([]);
  });
});
