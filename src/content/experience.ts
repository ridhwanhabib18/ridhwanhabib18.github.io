import { resumeData, toL10n } from './resume-data';
import type { Role } from './types';

/**
 * Titles, companies, dates and bullets come from resume/resume_us.typ (via resume.generated.json).
 * Only the tech-stack chips and the links to case studies are kept here.
 */
const find = (needle: string) => {
  const e = resumeData.experience.find((x) => x.company.includes(needle));
  if (!e) throw new Error(`experience: no role for "${needle}" in the resume source`);
  return e;
};

const fromSource = (needle: string, id: string, extra: Pick<Role, 'stack' | 'projectSlugs'>): Role => {
  const e = find(needle);
  return {
    id,
    title: toL10n(e.title),
    company: e.company,
    location: e.location,
    start: e.start,
    end: e.end === 'Present' ? null : e.end,
    bullets: e.bullets.map((b) => ({ title: b.title ? toL10n(b.title) : undefined, text: toL10n(b.text) })),
    ...extra,
  };
};

export const roles: Role[] = [
  fromSource('Epson', 'epson', {
    stack: ['ASP.NET Core', 'C#', 'React', 'TypeScript', 'SQL Server', 'EF Core', 'Dapper', 'SignalR', 'Quartz.NET', 'Hangfire', 'AWS', 'GitHub Actions'],
    projectSlugs: [
      'parts-engineering-management',
      'production-file-distribution',
      'production-planning-scheduling',
      'paperless-invoice-approval',
      'process-inspection-data',
      'part-approval-certification',
      'operator-cycle-time-monitoring',
      'printer-function-test-summary',
    ],
  }),
  fromSource('Xirka', 'xirka', { stack: ['Arduino', 'C', 'C++', 'RS-232', 'RS-485'], projectSlugs: [] }),
];
