import type { L10n } from './types';

export type ResumeKey = 'lead' | 'senior' | 'analyst';

export interface ResumeVariant {
  key: ResumeKey;
  label: L10n;
  target: L10n;
  summary: L10n;
  /** Path under public/ once the PDF is compiled and synced. Leave null until then. */
  pdf: string | null;
}

export const resumeVariants: ResumeVariant[] = [
  {
    key: 'lead',
    label: { en: 'Tech Lead', id: 'Tech Lead' },
    target: { en: 'For Tech Lead roles', id: 'Untuk peran Tech Lead' },
    summary: {
      en: 'Full Stack .NET Engineer and technical lead of a 2-person team at PT Indonesia Epson Industry. Over 4+ years, delivered 5 manufacturing systems end to end, from business case and design reviews to architecture, ASP.NET Core and React code, SQL Server, CI/CD and production support. Set coding standards, run code reviews and mentor a junior developer.',
      id: 'Full Stack .NET Engineer dan technical lead tim beranggotakan 2 orang di PT Indonesia Epson Industry. Selama 4+ tahun, menyelesaikan 5 sistem manufaktur end to end, dari business case dan design review hingga arsitektur, kode ASP.NET Core dan React, SQL Server, CI/CD, dan dukungan produksi. Menetapkan standar coding, memimpin code review, dan membimbing seorang junior developer.',
    },
    pdf: null,
  },
  {
    key: 'senior',
    label: { en: 'Senior Engineer', id: 'Senior Engineer' },
    target: { en: 'For Senior Software Engineer (.NET) roles', id: 'Untuk peran Senior Software Engineer (.NET)' },
    summary: {
      en: 'Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry, delivering 5 manufacturing systems end to end with ASP.NET Core, React/TypeScript and SQL Server, backed by CI/CD, integration tests and clear system design. One system cut part review preparation by about 86%.',
      id: 'Full Stack .NET Engineer dengan pengalaman 4+ tahun di PT Indonesia Epson Industry, menyelesaikan 5 sistem manufaktur end to end dengan ASP.NET Core, React/TypeScript, dan SQL Server, didukung CI/CD, tes integrasi, dan desain sistem yang jelas. Satu sistem memangkas persiapan part review sekitar 86%.',
    },
    pdf: null,
  },
  {
    key: 'analyst',
    label: { en: 'System Analyst', id: 'System Analyst' },
    target: { en: 'For System Analyst roles', id: 'Untuk peran System Analyst' },
    summary: {
      en: 'Full Stack .NET Engineer with 4+ years at PT Indonesia Epson Industry who turns requirements from production, engineering, purchasing and management into business cases, PRDs and system designs, then delivers them. Delivered 5 manufacturing systems, one of which cut part review preparation by about 86%.',
      id: 'Full Stack .NET Engineer dengan pengalaman 4+ tahun di PT Indonesia Epson Industry yang mengubah kebutuhan dari produksi, engineering, purchasing, dan manajemen menjadi business case, PRD, dan desain sistem, lalu mengimplementasikannya. Menyelesaikan 5 sistem manufaktur, salah satunya memangkas persiapan part review sekitar 86%.',
    },
    pdf: null,
  },
];
