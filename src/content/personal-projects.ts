import type { DiagramDef, L10n, Tag } from './types';

/**
 * Personal projects: built outside an employer, with public code. They are not case studies of the resume, so they do not go
 * through the resume guards (resume bullets, Actual/Target metrics); everything stated here must come from the project's own
 * README and documentation, and its links must be public. A test checks the links, the images and that no employer material
 * or credentials appear. Each project has a card on the Projects page and its own page at /work/<slug>.
 */
export interface PersonalProject {
  slug: string;
  title: L10n;
  summary: L10n;
  /** Where the project stands: finished (all planned phases built and tested) or still being built. */
  state: 'done' | 'in-progress';
  /** A short note on the state, taken from the project's README (for example that it is not deployed yet). */
  status: L10n;
  role: L10n;
  year: string;
  tags: Tag[];
  /** The few technologies shown on the card. */
  cardStack: string[];
  overview: L10n<string[]>;
  roles: { name: L10n; needs: L10n }[];
  features: { id: string; title: L10n; note: L10n }[];
  aiFeatures: { id: string; title: L10n }[];
  architecture: {
    intro: L10n;
    diagrams: { title: L10n; def: DiagramDef }[];
    layers: { name: string; does: L10n; dependsOn: L10n }[];
  };
  qualityGoals: { goal: L10n; target: L10n; response: L10n }[];
  design: { title: L10n; body: L10n<string[]> }[];
  dataModules: string[];
  decisions: { id: string; title: L10n; summary: L10n; href: string }[];
  /** The whole stack named in the project's documentation (PRD section 6), by layer. */
  stackGroups: { group: L10n; items: string[] }[];
  highlights: L10n<string[]>;
  docs: { label: L10n; href: string }[];
  gettingStarted: { requirements: L10n; commands: string[] };
  phases: { n: number; scope: L10n; done: boolean; note?: L10n }[];
  /** Images copied from the project's public repository into public/projects/<slug>/ (fictional demo data only). */
  gallery: { kind: 'flow' | 'shot'; file: string; width: number; height: number; caption: L10n }[];
  links: { label: L10n; href: string }[];
}

const REPO = 'https://github.com/ridhwanhabib18/schomans';
const DOCS = `${REPO}/blob/main/docs/en`;

const containers: DiagramDef = {
  nodes: [
    { id: 'browser', label: 'Browser: React SPA (PWA)', col: 0, row: 1, kind: 'client' },
    { id: 'proxy', label: 'Caddy reverse proxy (HTTPS)', col: 1, row: 1, kind: 'service' },
    { id: 'web', label: 'web: React build (static)', col: 2, row: 0, kind: 'service' },
    { id: 'api', label: 'api: ASP.NET Core .NET 10', col: 2, row: 1, kind: 'service' },
    { id: 'kc', label: 'Keycloak (OIDC + PKCE)', col: 2, row: 2, kind: 'service' },
    { id: 'sql', label: 'SQL Server 2022 Express', col: 3, row: 1, kind: 'data' },
    { id: 'r2', label: 'Cloudflare R2 (S3 files)', col: 3, row: 0, kind: 'external' },
    { id: 'claude', label: 'Claude API', col: 3, row: 2, kind: 'external' },
    { id: 'mail', label: 'Email (SMTP)', col: 3, row: 3, kind: 'external' },
  ],
  edges: [
    { from: 'browser', to: 'proxy' },
    { from: 'proxy', to: 'web' },
    { from: 'proxy', to: 'api' },
    { from: 'proxy', to: 'kc' },
    { from: 'api', to: 'sql' },
    { from: 'api', to: 'kc', label: 'keys, user sync' },
    { from: 'api', to: 'r2' },
    { from: 'api', to: 'claude' },
    { from: 'api', to: 'mail' },
  ],
};

const layers: DiagramDef = {
  nodes: [
    { id: 'api', label: 'Api', col: 0, row: 1, kind: 'client' },
    { id: 'infra', label: 'Infrastructure', col: 2, row: 0, kind: 'external' },
    { id: 'app', label: 'Application', col: 2, row: 2, kind: 'service' },
    { id: 'domain', label: 'Domain', col: 3, row: 2, kind: 'data' },
  ],
  edges: [
    { from: 'api', to: 'infra', label: 'DI wiring' },
    { from: 'api', to: 'app', label: 'injects handlers' },
    { from: 'infra', to: 'app', label: 'implements interfaces' },
    { from: 'app', to: 'domain' },
  ],
};

export const personalProjects: PersonalProject[] = [
  {
    slug: 'schomans',
    title: { en: 'SchoMans: School Management System', id: 'SchoMans: Sistem Manajemen Sekolah' },
    summary: {
      en: 'Attendance, grading, assignments, admissions, announcements, administrative approvals and AI assistance in one platform for teachers, students, parents and school staff.',
      id: 'Absensi, penilaian, tugas, penerimaan siswa baru, pengumuman, persetujuan administrasi, dan bantuan AI dalam satu platform untuk guru, siswa, orang tua, dan staf sekolah.',
    },
    state: 'done',
    status: {
      en: 'All eight phases are built and tested. The deployment files are ready; a hosted demo is not deployed yet.',
      id: 'Kedelapan fase sudah dibangun dan diuji. Berkas deployment sudah siap; demo yang di-host belum di-deploy.',
    },
    role: { en: 'System Architect, System Design and Author, assisted by Claude', id: 'System Architect, System Design, dan Penulis, dibantu Claude' },
    year: '2026',
    tags: ['aspnet', 'react', 'realtime', 'data'],
    cardStack: ['.NET 10', 'ASP.NET Core Web API', 'SQL Server 2022', 'Keycloak', 'SignalR', 'React 19', 'TypeScript'],
    overview: {
      en: [
        'School processes are often still manual and scattered across paper, spreadsheets and chat groups, so information arrives late and attendance, grades and approvals are hard to compile.',
        'SchoMans brings them into one platform for six roles (principal, teacher, student, parent, admin staff and applicant), plus a public site for guests. It is designed for a single school of up to 1,500 students and 100 teachers, run by one developer on one server, with boundaries clean enough to split later.',
      ],
      id: [
        'Proses sekolah sering masih manual dan tersebar di kertas, spreadsheet, dan grup obrolan, sehingga informasi terlambat dan absensi, nilai, serta persetujuan sulit direkap.',
        'SchoMans menyatukannya dalam satu platform untuk enam peran (kepala sekolah, guru, siswa, orang tua, staf administrasi, dan calon siswa), ditambah situs publik untuk tamu. Dirancang untuk satu sekolah hingga 1.500 siswa dan 100 guru, dijalankan satu developer di satu server, dengan batas yang cukup bersih untuk dipisah nanti.',
      ],
    },
    roles: [
      { name: { en: 'Principal', id: 'Kepala sekolah' }, needs: { en: 'Approvals, school-wide attendance and grade monitoring', id: 'Persetujuan, pemantauan absensi dan nilai seluruh sekolah' } },
      { name: { en: 'Teacher', id: 'Guru' }, needs: { en: 'Enter grades, give assignments, class attendance, request leave', id: 'Mengisi nilai, memberi tugas, absensi kelas, mengajukan izin' } },
      { name: { en: 'Student', id: 'Siswa' }, needs: { en: 'View and submit assignments, scan the attendance QR, view grades', id: 'Melihat dan mengumpulkan tugas, memindai QR absensi, melihat nilai' } },
      { name: { en: 'Parent', id: 'Orang tua' }, needs: { en: "Follow their child's grades, attendance and announcements", id: 'Mengikuti nilai, absensi, dan pengumuman anak' } },
      { name: { en: 'Admin staff', id: 'Staf administrasi' }, needs: { en: 'Manage master data, admissions, letters and user accounts', id: 'Mengelola data induk, penerimaan siswa, surat, dan akun pengguna' } },
      { name: { en: 'Applicant', id: 'Calon siswa' }, needs: { en: 'Fill in the admission form, upload documents, track the selection status', id: 'Mengisi formulir penerimaan, mengunggah dokumen, melacak status seleksi' } },
      { name: { en: 'Guest', id: 'Tamu' }, needs: { en: 'Read news and admission information, use the chatbot, start registration', id: 'Membaca berita dan info penerimaan, memakai chatbot, memulai pendaftaran' } },
    ],
    features: [
      { id: 'F-01', title: { en: 'Master data', id: 'Data induk' }, note: { en: 'Students, teachers, classrooms, subjects and academic years, with Excel import.', id: 'Siswa, guru, kelas, mata pelajaran, dan tahun ajaran, dengan impor Excel.' } },
      { id: 'F-02', title: { en: 'Authentication and permissions', id: 'Autentikasi dan hak akses' }, note: { en: 'Role-based access for 6 roles with Keycloak.', id: 'Akses berbasis peran untuk 6 peran dengan Keycloak.' } },
      { id: 'F-03', title: { en: 'QR attendance', id: 'Absensi QR' }, note: { en: 'A rotating QR code, a check against proxy check-in, and live updates for the teacher.', id: 'Kode QR yang berganti, pemeriksaan terhadap absen titipan, dan pembaruan langsung untuk guru.' } },
      { id: 'F-04', title: { en: 'Assignments', id: 'Tugas' }, note: { en: 'A basic learning system with file upload and due dates.', id: 'Sistem belajar dasar dengan unggah berkas dan tenggat.' } },
      { id: 'F-05', title: { en: 'Grading and report cards', id: 'Penilaian dan rapor' }, note: { en: 'Grade book and PDF report cards.', id: 'Buku nilai dan rapor PDF.' } },
      { id: 'F-06', title: { en: 'News and announcements', id: 'Berita dan pengumuman' }, note: { en: 'Delivered in real time to the intended roles.', id: 'Dikirim secara real-time ke peran yang dituju.' } },
      { id: 'F-07', title: { en: 'Online admissions', id: 'Penerimaan siswa online' }, note: { en: 'A multi-step workflow for applicants, with documents and status.', id: 'Alur bertahap untuk calon siswa, dengan dokumen dan status.' } },
      { id: 'F-08', title: { en: 'Administration and approvals', id: 'Administrasi dan persetujuan' }, note: { en: 'Multi-level approvals, for example a leave request from a parent.', id: 'Persetujuan bertingkat, misalnya permohonan izin dari orang tua.' } },
      { id: 'F-09', title: { en: 'Analytics dashboard', id: 'Dashboard analitik' }, note: { en: 'Charts per role.', id: 'Grafik untuk setiap peran.' } },
      { id: 'F-10', title: { en: 'AI features', id: 'Fitur AI' }, note: { en: 'Eight features, with a person reviewing before they take effect (see below).', id: 'Delapan fitur, dengan peninjauan manusia sebelum berlaku (lihat di bawah).' } },
      { id: 'F-11', title: { en: 'Audit log and notifications', id: 'Log audit dan notifikasi' }, note: { en: 'An audit trail for grade, attendance and approval changes, and email notifications.', id: 'Jejak audit untuk perubahan nilai, absensi, dan persetujuan, serta notifikasi email.' } },
    ],
    aiFeatures: [
      { id: 'AI-01', title: { en: 'Progress summary for parents', id: 'Ringkasan perkembangan untuk orang tua' } },
      { id: 'AI-02', title: { en: 'Report-card achievement descriptions', id: 'Deskripsi capaian di rapor' } },
      { id: 'AI-03', title: { en: 'Admission document extraction', id: 'Ekstraksi dokumen penerimaan' } },
      { id: 'AI-04', title: { en: 'Principal assistant', id: 'Asisten kepala sekolah' } },
      { id: 'AI-05', title: { en: 'Rubric-based essay feedback', id: 'Umpan balik esai berbasis rubrik' } },
      { id: 'AI-06', title: { en: 'Question generator from materials', id: 'Pembuat soal dari materi' } },
      { id: 'AI-08', title: { en: 'School and admissions chatbot', id: 'Chatbot sekolah dan penerimaan' } },
      { id: 'AI-09', title: { en: 'Announcement and letter drafts', id: 'Draf pengumuman dan surat' } },
    ],
    architecture: {
      intro: {
        en: 'A monolith with Clean Architecture and vertical slices. One deployable API keeps operations simple for a single developer, while a folder per feature and interfaces for every external service keep the features apart. The whole stack runs from one Docker Compose file behind a reverse proxy.',
        id: 'Monolit dengan Clean Architecture dan vertical slice. Satu API yang di-deploy menjaga operasional tetap sederhana untuk satu developer, sementara satu folder per fitur dan antarmuka untuk setiap layanan eksternal menjaga fitur tetap terpisah. Seluruh stack berjalan dari satu berkas Docker Compose di belakang reverse proxy.',
      },
      diagrams: [
        { title: { en: 'Containers and deployment', id: 'Kontainer dan deployment' }, def: containers },
        { title: { en: 'Application layers (dependencies point inward)', id: 'Lapisan aplikasi (dependensi mengarah ke dalam)' }, def: layers },
      ],
      layers: [
        { name: 'Domain', does: { en: 'Entities, value objects, status transitions and business rules.', id: 'Entitas, value object, transisi status, dan aturan bisnis.' }, dependsOn: { en: 'Nothing', id: 'Tidak ada' } },
        { name: 'Application', does: { en: 'One folder per use case (command or query, handler, validator), interfaces for external services, a result type.', id: 'Satu folder per use case (command atau query, handler, validator), antarmuka untuk layanan eksternal, tipe hasil.' }, dependsOn: { en: 'Domain', id: 'Domain' } },
        { name: 'Infrastructure', does: { en: 'EF Core, S3, Claude, QuestPDF, ClosedXML, Hangfire jobs, Keycloak user sync.', id: 'EF Core, S3, Claude, QuestPDF, ClosedXML, job Hangfire, sinkronisasi pengguna Keycloak.' }, dependsOn: { en: 'Application, Domain', id: 'Application, Domain' } },
        { name: 'Api', does: { en: 'Minimal API endpoints, SignalR hubs, authentication, middleware.', id: 'Endpoint Minimal API, hub SignalR, autentikasi, middleware.' }, dependsOn: { en: 'Application, Infrastructure (dependency injection wiring only)', id: 'Application, Infrastructure (hanya pengaitan dependency injection)' } },
      ],
    },
    qualityGoals: [
      { goal: { en: 'Responsiveness', id: 'Responsivitas' }, target: { en: 'A QR scan is recorded in under 3 s; announcements arrive in under 5 s', id: 'Pemindaian QR tercatat kurang dari 3 detik; pengumuman tiba kurang dari 5 detik' }, response: { en: 'SignalR push, indexed lookups, idempotent scan writes', id: 'Push SignalR, pencarian terindeks, penulisan pemindaian yang idempoten' } },
      { goal: { en: 'Security and privacy', id: 'Keamanan dan privasi' }, target: { en: "Children's data is visible only to authorized roles", id: 'Data anak hanya terlihat oleh peran yang berwenang' }, response: { en: 'Keycloak OIDC, a policy per endpoint, ownership checks in the Application layer, a private S3 bucket', id: 'OIDC Keycloak, kebijakan per endpoint, pemeriksaan kepemilikan di lapisan Application, bucket S3 privat' } },
      { goal: { en: 'Testability', id: 'Kemudahan pengujian' }, target: { en: 'Coverage of at least 70%, integration tests for every endpoint', id: 'Cakupan minimal 70%, tes integrasi untuk setiap endpoint' }, response: { en: 'Clean Architecture, external services behind interfaces, Testcontainers', id: 'Clean Architecture, layanan eksternal di balik antarmuka, Testcontainers' } },
      { goal: { en: 'Operability', id: 'Kemudahan operasional' }, target: { en: 'One-command local setup and deploy', id: 'Setup lokal dan deploy dengan satu perintah' }, response: { en: 'Docker Compose, a Keycloak realm export, seeded demo data, health checks', id: 'Docker Compose, ekspor realm Keycloak, data demo awal, health check' } },
      { goal: { en: 'Cost', id: 'Biaya' }, target: { en: 'Free software; only hosting and the Claude API are paid', id: 'Perangkat lunak gratis; hanya hosting dan Claude API yang berbayar' }, response: { en: 'An open-source stack, AI budget caps, a mock AI mode', id: 'Stack open-source, batas anggaran AI, mode AI tiruan' } },
      { goal: { en: 'Evolvability', id: 'Kemudahan berkembang' }, target: { en: 'Add features or locales without rewiring', id: 'Menambah fitur atau bahasa tanpa merombak' }, response: { en: 'Vertical slices, i18n, a multi-tenant-ready schema', id: 'Vertical slice, i18n, skema yang siap multi-tenant' } },
    ],
    design: [
      {
        title: { en: 'Security and authorization', id: 'Keamanan dan otorisasi' },
        body: {
          en: [
            'Sign-in is OIDC Authorization Code with PKCE against Keycloak. The single-page app keeps tokens in memory and the API validates JWT bearer tokens.',
            'Authorization has two layers: a role policy on every endpoint, then a data-ownership check in the Application layer (for example, a parent sees only their own child).',
            'Other controls: rate limiting on login, the public chatbot and uploads; file type and size validation before an upload URL is issued; HTTPS only behind the reverse proxy; secrets in environment variables, never in the repository; an audit log for grade, attendance and approval changes.',
          ],
          id: [
            'Masuk memakai OIDC Authorization Code dengan PKCE terhadap Keycloak. Aplikasi satu halaman menyimpan token di memori dan API memvalidasi token JWT bearer.',
            'Otorisasi punya dua lapis: kebijakan peran di setiap endpoint, lalu pemeriksaan kepemilikan data di lapisan Application (misalnya orang tua hanya melihat anaknya sendiri).',
            'Kontrol lain: pembatasan laju pada login, chatbot publik, dan unggahan; validasi tipe dan ukuran berkas sebelum URL unggah diberikan; HTTPS saja di belakang reverse proxy; rahasia di variabel lingkungan, tidak pernah di repositori; log audit untuk perubahan nilai, absensi, dan persetujuan.',
          ],
        },
      },
      {
        title: { en: 'Real-time events and background jobs', id: 'Event real-time dan job latar belakang' },
        body: {
          en: [
            'Two SignalR hubs, signed in with the same JWT. AttendanceHub sends QrRotated, SessionClosed and StudentCheckedIn; NotificationHub sends NotificationCreated.',
            'Hangfire runs the recurring jobs with SQL Server storage: rotate the attendance QR every minute, close forgotten attendance sessions every 15 minutes, publish admission results every 5 minutes, send queued emails every minute, draft parent progress summaries at the start of each month, and send assignment due reminders every morning.',
          ],
          id: [
            'Dua hub SignalR, dengan JWT yang sama. AttendanceHub mengirim QrRotated, SessionClosed, dan StudentCheckedIn; NotificationHub mengirim NotificationCreated.',
            'Hangfire menjalankan job berulang dengan penyimpanan SQL Server: mengganti QR absensi tiap menit, menutup sesi absensi yang terlupa tiap 15 menit, mengumumkan hasil penerimaan tiap 5 menit, mengirim email antrean tiap menit, menyusun draf ringkasan perkembangan orang tua di awal setiap bulan, dan mengirim pengingat tenggat tugas tiap pagi.',
          ],
        },
      },
      {
        title: { en: 'File storage', id: 'Penyimpanan berkas' },
        body: {
          en: [
            'Files use the S3 API: SeaweedFS locally, Cloudflare R2 for a hosted demo. There are two buckets, a private one for student files and a public one for news images.',
            'The private bucket is never public. Downloads use presigned URLs that expire in five minutes and are created only after the backend checks permissions. Large uploads go straight from the browser to S3 with a presigned URL, so the API does not carry file traffic. The database stores object keys, not URLs.',
          ],
          id: [
            'Berkas memakai S3 API: SeaweedFS secara lokal, Cloudflare R2 untuk demo yang di-host. Ada dua bucket, satu privat untuk berkas siswa dan satu publik untuk gambar berita.',
            'Bucket privat tidak pernah publik. Unduhan memakai presigned URL yang kedaluwarsa dalam lima menit dan dibuat hanya setelah backend memeriksa izin. Unggahan besar langsung dari browser ke S3 dengan presigned URL, sehingga API tidak membawa lalu lintas berkas. Database menyimpan kunci objek, bukan URL.',
          ],
        },
      },
    ],
    dataModules: ['Admissions', 'AI', 'Approvals', 'Assignments', 'Attendance', 'Audit', 'Communication', 'Grading', 'Students'],
    decisions: [
      {
        id: 'ADR-001',
        title: { en: 'No mediator pattern', id: 'Tanpa pola mediator' },
        summary: { en: 'Endpoints call handlers directly through dependency injection. No CQRS library, because it adds a layer without a need and MediatR became commercially licensed.', id: 'Endpoint memanggil handler langsung lewat dependency injection. Tanpa pustaka CQRS, karena menambah lapisan tanpa kebutuhan dan MediatR kini berlisensi komersial.' },
        href: `${DOCS}/adr/001-no-mediator.md`,
      },
      {
        id: 'ADR-002',
        title: { en: 'Minimal API instead of controllers', id: 'Minimal API, bukan controller' },
        summary: { en: 'One endpoint file per feature, which fits the per-feature layout and the direct handler calls.', id: 'Satu berkas endpoint per fitur, sesuai tata letak per fitur dan pemanggilan handler langsung.' },
        href: `${DOCS}/adr/002-minimal-api.md`,
      },
      {
        id: 'ADR-003',
        title: { en: 'Changing a role through the Keycloak Admin API', id: 'Mengubah peran lewat Admin API Keycloak' },
        summary: { en: 'When an applicant is enrolled, the API changes the realm role in Keycloak first, so the next login does not undo it, behind an identity provisioning interface.', id: 'Saat calon siswa didaftarkan, API mengubah peran realm di Keycloak lebih dulu agar login berikutnya tidak membatalkannya, di balik antarmuka identity provisioning.' },
        href: `${DOCS}/adr/003-keycloak-role-change.md`,
      },
      {
        id: 'ADR-004',
        title: { en: 'AI providers behind one interface, mock by default', id: 'Penyedia AI di balik satu antarmuka, tiruan secara bawaan' },
        summary: { en: 'The Application layer knows one AI interface; the provider is chosen by configuration. The mock is the default, so demos and tests cost nothing and as little school data as possible leaves the machine.', id: 'Lapisan Application hanya mengenal satu antarmuka AI; penyedianya dipilih lewat konfigurasi. Tiruan adalah bawaan, sehingga demo dan tes tidak berbiaya dan data sekolah sesedikit mungkin keluar dari mesin.' },
        href: `${DOCS}/adr/004-ai-providers.md`,
      },
      {
        id: 'ADR-005',
        title: { en: 'One VPS behind Caddy, and documents generated from the code', id: 'Satu VPS di belakang Caddy, dan dokumen dihasilkan dari kode' },
        summary: { en: 'Caddy ends TLS for the app and for Keycloak on separate addresses. The API reference, authorization matrix, jobs and real-time events, and the ERD are generated from the code and checked, so they cannot silently fall behind.', id: 'Caddy mengakhiri TLS untuk aplikasi dan Keycloak di alamat terpisah. Referensi API, matriks otorisasi, job dan event real-time, serta ERD dihasilkan dari kode dan diperiksa, sehingga tidak bisa diam-diam tertinggal.' },
        href: `${DOCS}/adr/005-deployment-and-generated-docs.md`,
      },
    ],
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
    docs: [
      { label: { en: 'Product requirements (PRD)', id: 'Kebutuhan produk (PRD)' }, href: `${DOCS}/PRD.md` },
      { label: { en: 'System design', id: 'Desain sistem' }, href: `${DOCS}/system-design.md` },
      { label: { en: 'Architecture decisions', id: 'Keputusan arsitektur' }, href: `${REPO}/tree/main/docs/en/adr` },
      { label: { en: 'Technical Q&A', id: 'Tanya jawab teknis' }, href: `${DOCS}/technical-qa.md` },
      { label: { en: 'Deployment guide', id: 'Panduan deployment' }, href: `${DOCS}/deployment.md` },
      { label: { en: 'API reference (generated from the code)', id: 'Referensi API (dihasilkan dari kode)' }, href: `${DOCS}/generated/api-reference.md` },
      { label: { en: 'Authorization matrix (generated)', id: 'Matriks otorisasi (dihasilkan)' }, href: `${DOCS}/generated/authorization-matrix.md` },
      { label: { en: 'Jobs and real-time events (generated)', id: 'Job dan event real-time (dihasilkan)' }, href: `${DOCS}/generated/jobs-and-realtime.md` },
      { label: { en: 'Data model (ERD)', id: 'Model data (ERD)' }, href: `${DOCS}/diagrams/erd.mmd` },
      { label: { en: 'Test evidence for each phase', id: 'Bukti pengujian untuk setiap fase' }, href: `${REPO}/tree/main/docs/assets/testing` },
      { label: { en: 'Demo video script', id: 'Naskah video demo' }, href: `${DOCS}/demo-video-script.md` },
      { label: { en: 'README in Indonesian', id: 'README dalam bahasa Indonesia' }, href: `${REPO}/blob/main/README.id.md` },
    ],
    gettingStarted: {
      requirements: { en: '.NET 10 SDK, Node.js 24 and Docker with Compose.', id: '.NET 10 SDK, Node.js 24, dan Docker dengan Compose.' },
      commands: [
        '# 1. Start SQL Server, Keycloak and SeaweedFS (copy the example env file first)',
        'cp infra/.env.example infra/.env',
        'docker compose -f infra/docker-compose.yml --env-file infra/.env up -d',
        '# 2. Run the API (applies migrations and seeds a fictional demo school in Development)',
        'dotnet run --project src/SchoMans.Api',
        '# 3. Run the web app',
        'cd web && npm install && npm run dev',
      ],
    },
    phases: [
      { n: 1, scope: { en: 'Foundation: solution, Docker Compose, authentication and roles, i18n, demo data', id: 'Fondasi: solusi, Docker Compose, autentikasi dan peran, i18n, data demo' }, done: true },
      { n: 2, scope: { en: 'Core data: master data, announcements', id: 'Data inti: data induk, pengumuman' }, done: true },
      { n: 3, scope: { en: 'Classroom: QR attendance, assignments', id: 'Kelas: absensi QR, tugas' }, done: true },
      { n: 4, scope: { en: 'Academics: grades, PDF report cards, dashboards', id: 'Akademik: nilai, rapor PDF, dashboard' }, done: true },
      { n: 5, scope: { en: 'School: admissions, approvals, public landing page', id: 'Sekolah: penerimaan, persetujuan, halaman publik' }, done: true },
      { n: 6, scope: { en: 'Core AI and extras: AI-01 to AI-04, audit log, email, PWA', id: 'AI inti dan tambahan: AI-01 sampai AI-04, log audit, email, PWA' }, done: true },
      { n: 7, scope: { en: 'Advanced AI: essay feedback, question generator, chatbot, drafts, question bank', id: 'AI lanjutan: umpan balik esai, pembuat soal, chatbot, draf, bank soal' }, done: true },
      {
        n: 8,
        scope: { en: 'Portfolio release: deployment files, screenshot and GIF gallery, regenerated documents', id: 'Rilis portofolio: berkas deployment, galeri tangkapan layar dan GIF, dokumen yang dibuat ulang' },
        done: true,
        note: { en: 'The deployment files are ready and tested on a development machine; nothing is deployed yet.', id: 'Berkas deployment sudah siap dan diuji di mesin development; belum ada yang di-deploy.' },
      },
    ],
    gallery: [
      { kind: 'flow', file: 'flows/qr-attendance.gif', width: 960, height: 600, caption: { en: 'QR attendance: the teacher shows the code, the student checks in, the teacher sees it live', id: 'Absensi QR: guru menampilkan kode, siswa melakukan check-in, guru melihatnya langsung' } },
      { kind: 'flow', file: 'flows/assignments.gif', width: 960, height: 600, caption: { en: 'Assignments: given, handed in, scored, followed by the student and the parent', id: 'Tugas: diberikan, dikumpulkan, dinilai, diikuti oleh siswa dan orang tua' } },
      { kind: 'flow', file: 'flows/approvals.gif', width: 960, height: 600, caption: { en: 'Approvals: a parent asks for a leave, the teacher and the principal decide', id: 'Persetujuan: orang tua mengajukan izin, guru dan kepala sekolah memutuskan' } },
      { kind: 'flow', file: 'flows/admissions.gif', width: 960, height: 600, caption: { en: 'Admissions: the applicant and the staff', id: 'Penerimaan: calon siswa dan staf' } },
      { kind: 'flow', file: 'flows/ai-features.gif', width: 960, height: 600, caption: { en: 'AI features: assistant, draft in the editor, question bank, school chatbot', id: 'Fitur AI: asisten, draf di editor, bank soal, chatbot sekolah' } },
      { kind: 'shot', file: 'screenshots/guest/home-desktop.png', width: 1440, height: 1718, caption: { en: 'Guest: landing page with the school chatbot', id: 'Tamu: halaman utama dengan chatbot sekolah' } },
      { kind: 'shot', file: 'screenshots/principal/dashboard-desktop.png', width: 1440, height: 900, caption: { en: 'Principal: dashboard', id: 'Kepala sekolah: dashboard' } },
      { kind: 'shot', file: 'screenshots/principal/requests-inbox-desktop.png', width: 1440, height: 900, caption: { en: 'Principal: approvals inbox', id: 'Kepala sekolah: kotak masuk persetujuan' } },
      { kind: 'shot', file: 'screenshots/admin-staff/manage-letters-desktop.png', width: 1440, height: 1187, caption: { en: 'Admin staff: general letters with letterhead, number and signature', id: 'Staf administrasi: surat umum dengan kop, nomor, dan tanda tangan' } },
      { kind: 'shot', file: 'screenshots/teacher/attendance-desktop.png', width: 1440, height: 900, caption: { en: "Teacher: today's lessons and QR attendance", id: 'Guru: pelajaran hari ini dan absensi QR' } },
      { kind: 'shot', file: 'screenshots/teacher/grading-desktop.png', width: 1440, height: 900, caption: { en: 'Teacher: grade book', id: 'Guru: buku nilai' } },
      { kind: 'shot', file: 'screenshots/student/dashboard-desktop.png', width: 1440, height: 900, caption: { en: 'Student: dashboard', id: 'Siswa: dashboard' } },
      { kind: 'shot', file: 'screenshots/parent/dashboard-desktop.png', width: 1440, height: 900, caption: { en: 'Parent: dashboard with both children', id: 'Orang tua: dashboard dengan kedua anak' } },
      { kind: 'shot', file: 'screenshots/applicant/admissions-desktop.png', width: 1440, height: 900, caption: { en: 'Applicant: application with documents and status', id: 'Calon siswa: pendaftaran dengan dokumen dan status' } },
      { kind: 'shot', file: 'screenshots/teacher/dashboard-mobile.png', width: 390, height: 844, caption: { en: 'Teacher: dashboard on a phone', id: 'Guru: dashboard di ponsel' } },
    ],
    links: [
      { label: { en: 'Source code on GitHub', id: 'Kode sumber di GitHub' }, href: REPO },
      { label: { en: 'System design', id: 'Desain sistem' }, href: `${DOCS}/system-design.md` },
      { label: { en: 'Architecture decisions', id: 'Keputusan arsitektur' }, href: `${REPO}/tree/main/docs/en/adr` },
    ],
  },
];

export const getPersonalProject = (slug: string) => personalProjects.find((p) => p.slug === slug);
