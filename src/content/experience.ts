import type { Role } from './types';

export const roles: Role[] = [
  {
    id: 'epson',
    title: { en: 'Full Stack .NET Developer (System Development Staff)', id: 'Full Stack .NET Developer (System Development Staff)' },
    company: 'PT Indonesia Epson Industry',
    location: 'Bekasi Regency, Indonesia',
    start: 'Dec 2022',
    end: null,
    summary: {
      en: 'Technical lead of a 2-person team. Delivered 5 manufacturing systems end to end and contributed to 3 more projects.',
      id: 'Technical lead tim beranggotakan 2 orang. Menyelesaikan 5 sistem manufaktur secara end to end dan berkontribusi pada 3 proyek lain.',
    },
    responsibilities: {
      en: [
        'Delivered 5 manufacturing systems from business case and stage-gate design review to architecture, code, deployment and production support; results are about 86% faster part review preparation and about 90% faster line recovery after program changes (actual).',
        'Turned requirements from production, engineering, purchasing and management into proposals and presented them at stage-gate design reviews.',
        'Led code reviews, set coding standards and mentored a junior developer in a 2-person team.',
        'Built GitHub Actions CI/CD with tests on every pull request, GitVersion and IIS deployment with backup and EF migration, plus API and database integration tests.',
        'Reverse-engineered PRDs, system designs, ERDs and ADRs for existing systems to cut knowledge risk.',
        'Contributed to 3 further projects: SQL Server stored procedures (certification preparation about 96% faster, actual), a SignalR WebSocket layer, and code review.',
      ],
      id: [
        'Menyelesaikan 5 sistem manufaktur mulai dari business case dan stage-gate design review hingga arsitektur, kode, deployment, dan dukungan produksi; hasilnya persiapan part review sekitar 86% lebih cepat dan pemulihan lini setelah perubahan program sekitar 90% lebih cepat (aktual).',
        'Mengubah kebutuhan dari produksi, engineering, purchasing, dan manajemen menjadi proposal dan mempresentasikannya di stage-gate design review.',
        'Memimpin code review, menetapkan standar coding, dan membimbing seorang junior developer dalam tim 2 orang.',
        'Membangun CI/CD GitHub Actions dengan tes pada setiap pull request, GitVersion, dan deployment IIS dengan backup dan migrasi EF, serta tes integrasi API dan database.',
        'Melakukan reverse-engineering PRD, desain sistem, ERD, dan ADR untuk sistem yang sudah ada guna mengurangi risiko pengetahuan.',
        'Berkontribusi pada 3 proyek lain: stored procedure SQL Server (persiapan sertifikasi sekitar 96% lebih cepat, aktual), lapisan WebSocket SignalR, dan code review.',
      ],
    },
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
  },
  {
    id: 'xirka',
    title: { en: 'Embedded System Engineer Intern', id: 'Embedded System Engineer Intern' },
    company: 'PT Xirka Silicon Technology',
    location: 'Bandung, Indonesia',
    start: 'Jan 2020',
    end: 'Feb 2020',
    summary: {
      en: 'Internship in embedded development.',
      id: 'Magang di bidang pengembangan embedded.',
    },
    responsibilities: {
      en: [
        'Implemented and tested RS-232 and RS-485 communication modules on embedded development boards.',
        'Developed embedded programs in Arduino, C and C++.',
        'Assisted hardware–software integration and system validation.',
      ],
      id: [
        'Mengimplementasikan dan menguji modul komunikasi RS-232 dan RS-485 pada board pengembangan embedded.',
        'Mengembangkan program embedded dengan Arduino, C, dan C++.',
        'Membantu integrasi perangkat keras–perangkat lunak dan validasi sistem.',
      ],
    },
    stack: ['Arduino', 'C', 'C++', 'RS-232', 'RS-485'],
    projectSlugs: [],
  },
];
