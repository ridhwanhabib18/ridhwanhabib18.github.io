import { resumeData, toL10n } from './resume-data';
import type { L10n } from './types';

export type ResumeKey = 'lead' | 'senior' | 'analyst';

export interface ResumeVariant {
  key: ResumeKey;
  label: L10n;
  target: L10n;
  summary: L10n;
  /** Path under public/. CI compiles these from resume/main.typ (see scripts/build-resume.mjs). Null shows a "coming soon" button. */
  pdf: string | null;
}

export const resumeVariants: ResumeVariant[] = [
  {
    key: 'lead',
    label: { en: 'Tech Lead', id: 'Tech Lead' },
    target: { en: 'For Tech Lead roles', id: 'Untuk peran Tech Lead' },
    summary: toL10n(resumeData.summaries.lead),
    pdf: 'resume/ridhwan-habib-resume-lead.pdf',
  },
  {
    key: 'senior',
    label: { en: 'Senior Engineer', id: 'Senior Engineer' },
    target: { en: 'For Senior Software Engineer (.NET) roles', id: 'Untuk peran Senior Software Engineer (.NET)' },
    summary: toL10n(resumeData.summaries.senior),
    pdf: 'resume/ridhwan-habib-resume-senior.pdf',
  },
  {
    key: 'analyst',
    label: { en: 'System Analyst', id: 'System Analyst' },
    target: { en: 'For System Analyst roles', id: 'Untuk peran System Analyst' },
    summary: toL10n(resumeData.summaries.analyst),
    pdf: 'resume/ridhwan-habib-resume-analyst.pdf',
  },
];
