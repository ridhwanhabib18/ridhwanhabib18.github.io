import data from './resume.generated.json';
import { idTranslations } from './resume.id';
import type { L10n } from './types';

/** Shape of src/content/resume.generated.json, produced by scripts/extract-resume.mjs from resume/resume_us.typ. */
export interface ResumeData {
  name: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  summaries: Record<'senior' | 'lead' | 'analyst', string>;
  experience: {
    title: string;
    company: string;
    location: string;
    start: string;
    end: string;
    bullets: { title?: string; text: string }[];
  }[];
  education: { institution: string; location: string; start: string; end: string; degree: string }[];
  skills: { group: string; items: string[] }[];
  certifications: { name: string; url: string }[];
}

export const resumeData = data as unknown as ResumeData;

/** English comes straight from the Typst source; Indonesian from resume.id.ts (falls back to English). */
export const toL10n = (en: string): L10n => ({ en, id: idTranslations[en] ?? en });

export const degreeName = (degree: string) => degree.split(', GPA')[0];
export const gpaOf = (degree: string) => degree.split(', GPA')[1]?.trim() ?? '';

/** Every English string from the resume source that must have an Indonesian translation. */
export function translatableStrings(r: ResumeData = resumeData): string[] {
  const out = [r.location, ...Object.values(r.summaries)];
  for (const role of r.experience) for (const b of role.bullets) out.push(...(b.title ? [b.title, b.text] : [b.text]));
  for (const s of r.skills) out.push(s.group);
  for (const e of r.education) out.push(degreeName(e.degree));
  return [...new Set(out)];
}
