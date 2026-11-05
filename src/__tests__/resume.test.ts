import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resumeVariants } from '../content/resume';
// @ts-expect-error plain ESM helper without types
import { findViolations, loadBlocklist } from '../../scripts/guardrail-lib.mjs';

const typ = readFileSync('resume/resume_us.typ', 'utf8');
const script = readFileSync('scripts/build-resume.mjs', 'utf8');

describe('resume source and PDF pipeline', () => {
  it('lets the variant and the public mode be chosen with --input', () => {
    expect(typ).toContain('sys.inputs.at("role"');
    expect(typ).toContain('sys.inputs.at("public"');
  });

  it('leaves the phone number and work-authorization line out of public builds', () => {
    expect(typ).toMatch(/phone: if public \{ "" \} else \{ phone \}/);
    expect(typ).toContain('#let show-work-auth = not public');
    expect(script).toContain("'public=true'");
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

  it('exports PDF 2.0 and verifies the file header', () => {
    expect(script).toContain("PDF_VERSION = '2.0'");
    expect(script).toContain("'--pdf-standard', PDF_VERSION");
    expect(script).toContain('%PDF-${PDF_VERSION}');
  });

  it('keeps the resume text within the confidentiality rules', () => {
    expect(findViolations(typ, loadBlocklist())).toEqual([]);
  });
});
