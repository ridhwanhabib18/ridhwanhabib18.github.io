import { describe, expect, it } from 'vitest';
import { resumeData } from '../content/resume-data';
import { projects } from '../content/projects';
import { roles } from '../content/experience';
import type { Project } from '../content/types';

/**
 * Case studies are richer than resume bullets, but they must not contradict or silently extend the resume.
 * - Per-project stacks only list technologies the resume names for that system.
 * - Numbers and technology names in the prose must appear in the resume bullet, or be declared in `beyondResume`.
 */

const epson = resumeData.experience.find((e) => e.company.includes('Epson'))!;

function bullet(title: string): string {
  const b = epson.bullets.find((x) => x.title === title);
  if (!b) throw new Error(`No bullet titled "${title}" in resume/resume_us.typ`);
  return `${b.title}: ${b.text}`;
}

// Different spellings of the same thing on the resume and on the site.
const SAME: string[][] = [
  ['Entity Framework Core', 'EF Core'],
  ['Telerik Reporting', 'Telerik'],
  ['AWS Textract', 'Textract'],
  ['Keycloak SSO', 'Keycloak'],
  ['Stored procedures', 'stored procedures'],
  ['Code review', 'reviewed code', 'code review'],
];
const variants = (t: string) => SAME.find((g) => g.some((x) => x.toLowerCase() === t.toLowerCase())) ?? [t];
const mentions = (text: string, term: string) => variants(term).some((v) => text.toLowerCase().includes(v.toLowerCase()));
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const TECH_GROUPS = ['Programming & Backend', 'Frontend', 'Cloud & Integration', 'DevOps & Quality', 'Desktop, Reporting & Automation', 'Additional Technologies'];
const vocabulary = [
  ...new Set([
    ...resumeData.skills
      .filter((s) => TECH_GROUPS.includes(s.group))
      .flatMap((s) => s.items.map((i) => i.replace(/\s*\(.*\)\s*$/, '').trim())),
    ...SAME.flat().filter((t) => t.length > 3),
    'WebSocket',
    'WinForms client',
  ]),
].filter((t) => t.length >= 3);

function prose(p: Project): string {
  const s = p.sections;
  return [
    p.title.en,
    p.summary.en,
    p.role.en,
    s.context.en,
    s.problem.en,
    ...s.approach.en,
    ...(s.decisions?.en ?? []),
    ...s.result.en,
    ...(s.lookback?.en ?? []),
    ...p.metrics.flatMap((m) => [m.label.en, m.value.en]),
    ...(p.diagram?.nodes.map((n) => n.label) ?? []),
    ...(p.diagram?.edges.map((e) => e.label ?? '') ?? []),
  ].join('\n');
}

describe('case studies stay consistent with the resume source', () => {
  it('points every case study at a real bullet in the resume source', () => {
    for (const p of projects) expect(() => bullet(p.resumeBullet), p.slug).not.toThrow();
  });

  it('lists only technologies the resume names for that system in its stack', () => {
    for (const p of projects) {
      const evidence = bullet(p.resumeBullet);
      for (const item of p.stack) expect(mentions(evidence, item), `${p.slug}: stack item "${item}" is not in the resume bullet "${p.resumeBullet}"`).toBe(true);
    }
  });

  it('lists only skills from the resume source in the role tech stack', () => {
    const skills = resumeData.skills.flatMap((s) => s.items).join(' | ');
    for (const r of roles) {
      const source = resumeData.experience.find((e) => e.company === r.company)!;
      const evidence = `${skills} | ${source.bullets.map((b) => b.text).join(' | ')}`;
      for (const item of r.stack.filter((t) => t.length > 1)) expect(mentions(evidence, item), `${r.company}: "${item}" is not in the resume skills or bullets`).toBe(true);
    }
  });

  it('only mentions technology names that the resume bullet names, or declares them as beyond the resume', () => {
    for (const p of projects) {
      const text = prose(p);
      const evidence = bullet(p.resumeBullet);
      const declared = (p.beyondResume ?? []).join(' | ');
      for (const term of vocabulary) {
        const found = new RegExp(`(^|[^\\w])${escapeRe(term)}($|[^\\w])`, 'i').test(text);
        if (found) expect(mentions(evidence, term) || mentions(declared, term), `${p.slug}: "${term}" is stated in the case study but is not in the resume bullet "${p.resumeBullet}" (add it to beyondResume if intended)`).toBe(true);
      }
    }
  });

  it('only uses numbers that the resume bullet has, or declares them as beyond the resume', () => {
    for (const p of projects) {
      const evidence = bullet(p.resumeBullet);
      const declared = (p.beyondResume ?? []).join(' | ');
      for (const n of prose(p).match(/(?<![\w.])\d+/g) ?? []) {
        expect(evidence.includes(n) || declared.includes(n), `${p.slug}: number "${n}" is not in the resume bullet "${p.resumeBullet}" (add it to beyondResume if intended)`).toBe(true);
      }
    }
  });

  it('keeps beyondResume honest: each declared detail is stated in the case study and absent from the resume', () => {
    for (const p of projects) {
      const text = prose(p).toLowerCase();
      const evidence = bullet(p.resumeBullet).toLowerCase();
      for (const d of p.beyondResume ?? []) {
        expect(text.includes(d.toLowerCase()), `${p.slug}: declared detail "${d}" is not in the case study any more`).toBe(true);
        expect(evidence.includes(d.toLowerCase()), `${p.slug}: "${d}" is already in the resume bullet, remove it from beyondResume`).toBe(false);
      }
    }
  });
});
