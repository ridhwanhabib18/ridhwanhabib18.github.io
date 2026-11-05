import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM helper without types
import { extractResume } from '../../scripts/extract-resume-lib.mjs';
import { idTranslations } from '../content/resume.id';
import { resumeData, translatableStrings } from '../content/resume-data';
import { resumeVariants } from '../content/resume';
import { roles } from '../content/experience';
import { profile } from '../content/profile';
import { projects } from '../content/projects';

const typ = readFileSync('resume/resume_us.typ', 'utf8');

describe('web content follows the Typst resume source', () => {
  it('has a generated data file that is up to date with resume/resume_us.typ', () => {
    // If this fails, run `npm run extract` (it also runs before `npm run dev` and `npm run build`).
    expect(resumeData).toEqual(extractResume(typ));
  });

  it('keeps the phone number out of the public repository and out of published content', () => {
    // The real number is only in the private repository; the public copy of the source has it blanked.
    expect(typ).toMatch(/^#let phone = ""/m);
    const phoneLike = /\+\d{1,3}[\d ]{8,}/;
    expect(typ).not.toMatch(phoneLike);
    const published = JSON.stringify({ resumeData, profile, roles, resumeVariants });
    expect(published).not.toMatch(phoneLike);
  });

  it('shows the source text on the site, word for word, in English', () => {
    for (const v of resumeVariants) expect(v.summary.en).toBe(resumeData.summaries[v.key]);
    const epson = roles.find((r) => r.id === 'epson')!;
    const source = resumeData.experience.find((e) => e.company.includes('Epson'))!;
    expect(epson.company).toBe(source.company);
    expect(epson.bullets.map((b) => b.text.en)).toEqual(source.bullets.map((b) => b.text));
    expect(profile.stack.map((g) => g.group.en)).toEqual(resumeData.skills.map((s) => s.group));
    expect(profile.certifications.map((c) => c.url)).toEqual(resumeData.certifications.map((c) => c.url));
  });

  it('has an Indonesian translation for every source string, and no stale ones', () => {
    const need = translatableStrings();
    const missing = need.filter((s) => !(s in idTranslations));
    expect(missing, `add Indonesian translations in src/content/resume.id.ts for:\n${missing.join('\n')}`).toEqual([]);
    const stale = Object.keys(idTranslations).filter((k) => !need.includes(k));
    expect(stale, `remove stale translations from src/content/resume.id.ts:\n${stale.join('\n')}`).toEqual([]);
  });

  it('keeps every percentage in the case studies consistent with the resume source', () => {
    const typPercents = new Set(typ.match(/\d+%/g));
    for (const p of projects) {
      for (const m of p.metrics) {
        for (const pct of m.value.en.match(/\d+%/g) ?? []) {
          expect(typPercents.has(pct), `${p.slug}: ${pct} is not in resume/resume_us.typ`).toBe(true);
        }
      }
    }
  });
});
