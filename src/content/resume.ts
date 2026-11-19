import { resumeData, toL10n } from './resume-data';
import type { L10n } from './types';

export type ResumeKey = 'lead' | 'senior' | 'analyst';
export type ResumeRegion = 'us' | 'ca' | 'au';

export interface ResumeRegionInfo {
  key: ResumeRegion;
  label: L10n;
  /** Paper size and format note shown next to the download button. */
  note: L10n;
}

/** The country formats offered on the Resume page. The United States one is the default. */
export const resumeRegions: ResumeRegionInfo[] = [
  { key: 'us', label: { en: 'United States', id: 'Amerika Serikat' }, note: { en: 'US Letter paper', id: 'Kertas US Letter' } },
  { key: 'ca', label: { en: 'Canada', id: 'Kanada' }, note: { en: 'US Letter paper, Canadian format (no photo, no date of birth)', id: 'Kertas US Letter, format Kanada (tanpa foto, tanpa tanggal lahir)' } },
  { key: 'au', label: { en: 'Australia', id: 'Australia' }, note: { en: 'A4 paper, Australian format', id: 'Kertas A4, format Australia' } },
];

/** Path under public/ of the PDF for a country and role. The United States keeps the original file names. */
export function resumePdfPath(region: ResumeRegion, key: ResumeKey): string {
  return region === 'us' ? `resume/ridhwan-habib-resume-${key}.pdf` : `resume/ridhwan-habib-resume-${region}-${key}.pdf`;
}

export interface ResumeVariant {
  key: ResumeKey;
  label: L10n;
  target: L10n;
  summary: L10n;
  /** United States PDF, path under public/. CI compiles all regions from resume/resume_*.typ (see scripts/build-resume.mjs). Null shows a "coming soon" button. Use resumePdfPath for the other regions. */
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

/** The variant offered by the one-click download buttons (the resume source marks "senior" as the recommended one). */
export const primaryResumeKey: ResumeKey = 'senior';

/** Public URL of a variant's PDF, or null when it has none. */
export function resumeHref(key: ResumeKey): string | null {
  const v = resumeVariants.find((x) => x.key === key);
  return v?.pdf ? `${import.meta.env.BASE_URL}${v.pdf}` : null;
}
