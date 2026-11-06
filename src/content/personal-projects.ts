import type { L10n, Tag } from './types';

/**
 * Personal projects: built outside an employer, with public code. They are not case studies of the resume, so they do not go
 * through the resume guards (resume bullets, Actual/Target metrics); everything stated here must come from the project's own
 * README and documentation, and its links must be public. A test checks the links and that no employer material appears.
 */
export interface PersonalProject {
  slug: string;
  title: L10n;
  summary: L10n;
  /** Where the project stands, taken from its README. */
  status: L10n;
  role: L10n;
  year: string;
  tags: Tag[];
  /** The whole stack named in the project's documentation (PRD section 6), by layer. */
  stackGroups: { group: L10n; items: string[] }[];
  highlights: L10n<string[]>;
  links: { label: L10n; href: string }[];
}

const REPO = 'https://github.com/ridhwanhabib18/schomans';

export const personalProjects: PersonalProject[] = [
  {
    slug: 'schomans',
    title: { en: 'SchoMans: School Management System', id: 'SchoMans: Sistem Manajemen Sekolah' },
    summary: {
      en: 'Attendance, grading, assignments, admissions, announcements, administrative approvals and AI assistance in one platform for teachers, students, parents and school staff.',
      id: 'Absensi, penilaian, tugas, penerimaan siswa baru, pengumuman, persetujuan administrasi, dan bantuan AI dalam satu platform untuk guru, siswa, orang tua, dan staf sekolah.',
    },
    status: {
      en: 'All eight phases are built and tested. The deployment files are ready; a hosted demo is not deployed yet.',
      id: 'Kedelapan fase sudah dibangun dan diuji. Berkas deployment sudah siap; demo yang di-host belum di-deploy.',
    },
    role: { en: 'System Architect, System Design and Author, assisted by Claude', id: 'System Architect, System Design, dan Penulis, dibantu Claude' },
    year: '2026',
    tags: ['aspnet', 'react', 'realtime', 'data'],
    stackGroups: [
      { group: { en: 'Backend', id: 'Backend' }, items: ['.NET 10', 'ASP.NET Core Web API', 'Clean Architecture', 'Entity Framework Core 10', 'FluentValidation', 'OpenAPI', 'Serilog', 'Seq'] },
      { group: { en: 'Data and files', id: 'Data dan berkas' }, items: ['SQL Server 2022', 'S3 API (AWSSDK.S3)', 'SeaweedFS', 'Cloudflare R2', 'QuestPDF', 'ClosedXML', 'PdfPig'] },
      { group: { en: 'Identity, real time and jobs', id: 'Identitas, real-time, dan job' }, items: ['Keycloak', 'OIDC with PKCE', 'JWT Bearer', 'SignalR', 'Hangfire'] },
      { group: { en: 'Frontend', id: 'Frontend' }, items: ['React 19', 'TypeScript', 'Vite', 'React Router', 'TanStack Query', 'Zustand', 'react-i18next', 'oidc-client-ts', 'Tailwind CSS', 'shadcn/ui', 'Recharts', 'Axios', 'orval'] },
      { group: { en: 'Testing', id: 'Pengujian' }, items: ['xUnit', 'Testcontainers', 'Vitest', 'Playwright'] },
      { group: { en: 'Delivery', id: 'Pengiriman' }, items: ['Docker Compose', 'Caddy', 'GitHub Actions'] },
      { group: { en: 'AI', id: 'AI' }, items: ['Claude API', 'Ollama'] },
    ],
    highlights: {
      en: [
        'Role-based access for 6 roles with Keycloak (OIDC with PKCE).',
        'Real-time QR attendance with SignalR.',
        'PDF report cards and letters, and analytics dashboards.',
        'AI features that a person reviews before they take effect (Claude API).',
        'Documentation kept with the code: PRD, system design and architecture decision records, plus an API reference, an authorization matrix and an ERD generated from the code and checked for being out of date.',
        'Unit, integration (SQL Server and S3 storage started with Testcontainers) and Playwright end-to-end tests, with test evidence kept for each phase.',
      ],
      id: [
        'Akses berbasis peran untuk 6 peran dengan Keycloak (OIDC dengan PKCE).',
        'Absensi QR real-time dengan SignalR.',
        'Rapor dan surat dalam PDF, serta dashboard analitik.',
        'Fitur AI yang ditinjau manusia sebelum berlaku (Claude API).',
        'Dokumentasi yang disimpan bersama kode: PRD, desain sistem, dan catatan keputusan arsitektur, ditambah referensi API, matriks otorisasi, dan ERD yang dihasilkan dari kode dan diperiksa apakah sudah usang.',
        'Tes unit, integrasi (SQL Server dan penyimpanan S3 dijalankan dengan Testcontainers), dan end-to-end Playwright, dengan bukti pengujian untuk setiap fase.',
      ],
    },
    links: [
      { label: { en: 'Source code on GitHub', id: 'Kode sumber di GitHub' }, href: REPO },
      { label: { en: 'System design', id: 'Desain sistem' }, href: `${REPO}/blob/main/docs/en/system-design.md` },
      { label: { en: 'Architecture decisions', id: 'Keputusan arsitektur' }, href: `${REPO}/tree/main/docs/en/adr` },
    ],
  },
];
