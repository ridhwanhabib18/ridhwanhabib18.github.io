import type { L10n } from './types';

export const profile = {
  name: 'Muhammad Ridhwan Habib Abdillah',
  shortName: 'Ridhwan',
  email: 'eng.ridhwan18@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mridhwanhabib',
  github: 'https://github.com/ridhwanhabib18',
  location: { en: 'Bekasi Regency, West Java, Indonesia', id: 'Kabupaten Bekasi, Jawa Barat, Indonesia' } as L10n,
  yearsExperience: '4+',
  /** Flip to false to hide the availability badge. */
  available: true,
  headline: {
    en: 'Full Stack .NET Engineer',
    id: 'Full Stack .NET Engineer',
  } as L10n,
  positioning: {
    en: 'I build business-critical manufacturing software and prove its value with measurable results.',
    id: 'Saya membangun perangkat lunak manufaktur yang kritis bagi bisnis dan membuktikan nilainya dengan hasil yang terukur.',
  } as L10n,
  availability: {
    en: 'Open to Tech Lead, Senior Software Engineer (.NET) and System Analyst roles',
    id: 'Terbuka untuk peran Tech Lead, Senior Software Engineer (.NET) dan System Analyst',
  } as L10n,
  about: {
    en: [
      'I am a Full Stack .NET Engineer and technical lead of a 2-person team at PT Indonesia Epson Industry. Over 4+ years I have delivered 5 manufacturing systems end to end, from business case and stage-gate design reviews to architecture, code, deployment and production support.',
      'My background is in Electrical Engineering (Universitas Gadjah Mada), so I am comfortable where software meets hardware and production lines.',
    ],
    id: [
      'Saya Full Stack .NET Engineer sekaligus technical lead tim beranggotakan 2 orang di PT Indonesia Epson Industry. Selama lebih dari 4 tahun saya telah menyelesaikan 5 sistem manufaktur secara end to end, mulai dari business case dan stage-gate design review hingga arsitektur, kode, deployment, dan dukungan produksi.',
      'Latar belakang saya Teknik Elektro (Universitas Gadjah Mada), sehingga saya nyaman bekerja di titik temu perangkat lunak, perangkat keras, dan lini produksi.',
    ],
  } as L10n<string[]>,
  howIWork: [
    {
      title: { en: 'System design', id: 'Desain sistem' } as L10n,
      body: {
        en: 'Layered architecture, PRDs, system designs, ERDs and ADRs, so knowledge does not live in one person’s head.',
        id: 'Arsitektur berlapis, PRD, desain sistem, ERD, dan ADR, agar pengetahuan tidak hanya ada di kepala satu orang.',
      } as L10n,
    },
    {
      title: { en: 'Quality', id: 'Kualitas' } as L10n,
      body: {
        en: 'GitHub Actions CI/CD, tests on every pull request, API and database integration tests, and code reviews.',
        id: 'CI/CD GitHub Actions, tes pada setiap pull request, tes integrasi API dan database, serta code review.',
      } as L10n,
    },
    {
      title: { en: 'Integration', id: 'Integrasi' } as L10n,
      body: {
        en: 'Keycloak SSO, AWS, background jobs (Quartz.NET, Hangfire) and real-time dashboards (SignalR).',
        id: 'Keycloak SSO, AWS, background job (Quartz.NET, Hangfire), dan dashboard real-time (SignalR).',
      } as L10n,
    },
    {
      title: { en: 'People', id: 'Kolaborasi' } as L10n,
      body: {
        en: 'I turn requirements from production, engineering, purchasing and management into proposals, present them at design reviews and mentor a junior developer.',
        id: 'Saya mengubah kebutuhan dari produksi, engineering, purchasing, dan manajemen menjadi proposal, mempresentasikannya di design review, dan membimbing seorang junior developer.',
      } as L10n,
    },
  ],
  stack: [
    { group: { en: 'Core', id: 'Inti' } as L10n, items: ['C#', 'ASP.NET Core', '.NET Framework', 'Entity Framework Core', 'Dapper', 'SignalR', 'T-SQL', 'SQL Server'] },
    { group: { en: 'Front end', id: 'Front end' } as L10n, items: ['React', 'TypeScript', 'Vite', 'MUI', 'KendoReact', 'Razor'] },
    { group: { en: 'Architecture & integration', id: 'Arsitektur & integrasi' } as L10n, items: ['REST APIs', 'Keycloak (OIDC, JWT)', 'AWS S3 / Textract / Cognito', 'MinIO', 'Quartz.NET', 'Hangfire', 'Elsa Workflows'] },
    { group: { en: 'DevOps & quality', id: 'DevOps & kualitas' } as L10n, items: ['Git', 'GitHub Actions', 'GitVersion', 'Azure DevOps', 'IIS', 'Docker', 'WebApplicationFactory tests'] },
    { group: { en: 'Desktop & reporting', id: 'Desktop & pelaporan' } as L10n, items: ['WinForms', 'ClickOnce', 'Telerik Reporting', 'EPPlus'] },
  ],
  certifications: [
    {
      name: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services',
      level: { en: 'Foundational', id: 'Foundational' } as L10n,
      url: 'https://www.credly.com/badges/bc1ed2db-21b9-462e-b08a-b3e727911062',
    },
    {
      name: 'AWS Certified AI Practitioner (AIF-C01)',
      issuer: 'Amazon Web Services',
      level: { en: 'Foundational', id: 'Foundational' } as L10n,
      url: 'https://www.credly.com/badges/995a969c-1ada-49e5-84de-53b483dca02f',
    },
  ],
  education: {
    school: 'Universitas Gadjah Mada',
    degree: { en: 'Bachelor of Engineering (S.T.) in Electrical Engineering', id: 'Sarjana Teknik (S.T.) Teknik Elektro' } as L10n,
    location: 'Yogyakarta, Indonesia',
    period: '2018 – 2022',
    gpa: '3.47 / 4.00',
  },
};
