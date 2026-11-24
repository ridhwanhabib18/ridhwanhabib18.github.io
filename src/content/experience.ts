import { resumeData, toL10n } from './resume-data';
import type { Role } from './types';

/**
 * Titles, companies, dates and bullets come from resume/resume_us.typ (via resume.generated.json).
 * Only the tech-stack chips and the links to case studies are kept here.
 * Bangkit is the one entry written here: it is on the site only, not in the resume.
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
    stack: ['ASP.NET Core', 'C#', 'React', 'TypeScript', 'SQL Server', 'Entity Framework Core', 'Dapper', 'SignalR', 'Quartz.NET', 'Hangfire', 'AWS', 'GitHub Actions'],
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
  {
    id: 'bangkit',
    title: { en: 'Machine Learning Cohort', id: 'Cohort Machine Learning' },
    company: 'Bangkit Academy led by Google, GoTo, and Traveloka',
    location: 'Online',
    start: 'Feb 2022',
    end: 'Jul 2022',
    bullets: [
      {
        text: {
          en: 'completed the Machine Learning path of Bangkit Academy, a six-month program led by Google, GoTo and Traveloka, and graduated with a certificate',
          id: 'menyelesaikan jalur Machine Learning Bangkit Academy, program enam bulan yang dipimpin Google, GoTo, dan Traveloka, dan lulus dengan sertifikat',
        },
      },
      {
        text: {
          en: 'studied Python, mathematics for machine learning, TensorFlow, computer vision, natural language processing (NLP) and time series, plus how to structure machine learning projects and deploy models',
          id: 'mempelajari Python, matematika untuk machine learning, TensorFlow, computer vision, natural language processing (NLP), dan time series, serta cara menyusun proyek machine learning dan men-deploy model',
        },
      },
      {
        text: {
          en: 'capstone project, as Machine Learning Engineer: built a mobile app that recognizes tourist landmarks in Indonesia',
          id: 'proyek capstone, sebagai Machine Learning Engineer: membangun aplikasi mobile yang mengenali landmark wisata di Indonesia',
        },
      },
    ],
    stack: ['TensorFlow', 'Python', 'Computer Vision', 'NLP', 'Time Series'],
    projectSlugs: [],
  },
  fromSource('Xirka', 'xirka', { stack: ['Arduino', 'C', 'C++', 'RS-232', 'RS-485'], projectSlugs: [] }),
  fromSource('Gadjah Mada Robotics', 'gmrt', { stack: ['C++', 'Arduino', 'STM32', 'PID', 'OpenCV', 'ROS', 'PCB design'], projectSlugs: [] }),
];
