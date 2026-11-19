import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { resumePdfPath, resumeRegions, resumeVariants } from '../content/resume';
// @ts-expect-error plain ESM helper without types
import { findViolations, loadBlocklist } from '../../scripts/guardrail-lib.mjs';

const typ = readFileSync('resume/resume_us.typ', 'utf8');
const sources = Object.fromEntries(resumeRegions.map((r) => [r.key, readFileSync(`resume/resume_${r.key}.typ`, 'utf8')]));
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

  it('lets every country format be built in public mode for every role, without the phone number', () => {
    expect(Object.keys(sources).sort()).toEqual(['au', 'ca', 'us']);
    for (const [key, src] of Object.entries(sources)) {
      expect(src, key).toContain('sys.inputs.at("role"');
      expect(src, key).toContain('sys.inputs.at("public"');
      expect(src, key).toMatch(/phone: if public { "" } else { phone }/);
      expect(src, key).toMatch(/^#let phone = ""/m);
    }
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

  it('offers United States, Canada and Australia with distinct file names, and builds them all', () => {
    expect(resumeRegions.map((r) => r.key)).toEqual(['us', 'ca', 'au']);
    const names = new Set<string>();
    for (const r of resumeRegions) {
      expect(script, r.key).toContain(`resume/resume_${r.key}.typ`);
      for (const v of resumeVariants) names.add(resumePdfPath(r.key, v.key));
    }
    expect(names.size).toBe(9);
    expect(resumePdfPath('us', 'senior')).toBe('resume/ridhwan-habib-resume-senior.pdf');
    expect(resumePdfPath('au', 'lead')).toBe('resume/ridhwan-habib-resume-au-lead.pdf');
    expect(script).toContain("prefix: 'ridhwan-habib-resume-ca'");
    expect(script).toContain("prefix: 'ridhwan-habib-resume-au'");
  });

  it('checks the published cover letter too, and keeps the phone number out of it', () => {
    expect(readFileSync('scripts/guardrail.mjs', 'utf8')).toContain("'public/cover-letter.html'");
    const letter = readFileSync('public/cover-letter.html', 'utf8');
    expect(findViolations(letter, loadBlocklist())).toEqual([]);
    expect(letter).not.toMatch(/\+\d{1,3}[\d ]{8,}/);
  });

  it('exports PDF 2.0 and verifies the file header', () => {
    expect(script).toContain("PDF_VERSION = '2.0'");
    expect(script).toContain("'--pdf-standard', PDF_VERSION");
    expect(script).toContain('%PDF-${PDF_VERSION}');
  });

  it('keeps the resume text within the confidentiality rules', () => {
    expect(findViolations(typ, loadBlocklist())).toEqual([]);
    for (const [key, src] of Object.entries(sources)) expect(findViolations(src, loadBlocklist()), key).toEqual([]);
  });
});
