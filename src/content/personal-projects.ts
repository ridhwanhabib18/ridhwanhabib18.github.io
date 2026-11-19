import type { DiagramDef, L10n, Tag } from './types';

/**
 * Personal projects: built outside an employer, with code that stays private (the pages show the design, the pictures and the decisions). They are not case studies of the resume, so they do not go
 * through the resume guards (resume bullets, Actual/Target metrics); everything stated here must come from the project's own
 * README and documentation, and no link to a private repository may appear. A test checks the links, the images and that no employer material
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
  decisions: { id: string; title: L10n; summary: L10n; href?: string }[];
  /** The whole stack named in the project's documentation (PRD section 6), by layer. */
  stackGroups: { group: L10n; items: string[] }[];
  highlights: L10n<string[]>;
  docs: { label: L10n; href: string }[];
  phases: { n: number; scope: L10n; done: boolean; note?: L10n }[];
  /** Images copied from the project's repository into public/projects/<slug>/ (fictional demo data only). */
  gallery: { kind: 'flow' | 'shot'; file: string; width: number; height: number; caption: L10n }[];
  links: { label: L10n; href: string }[];
}


const DEMO_BY = 'Muhammad Ridhwan Habib Abdillah';

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
      },
      {
        id: 'ADR-002',
        title: { en: 'Minimal API instead of controllers', id: 'Minimal API, bukan controller' },
        summary: { en: 'One endpoint file per feature, which fits the per-feature layout and the direct handler calls.', id: 'Satu berkas endpoint per fitur, sesuai tata letak per fitur dan pemanggilan handler langsung.' },
      },
      {
        id: 'ADR-003',
        title: { en: 'Changing a role through the Keycloak Admin API', id: 'Mengubah peran lewat Admin API Keycloak' },
        summary: { en: 'When an applicant is enrolled, the API changes the realm role in Keycloak first, so the next login does not undo it, behind an identity provisioning interface.', id: 'Saat calon siswa didaftarkan, API mengubah peran realm di Keycloak lebih dulu agar login berikutnya tidak membatalkannya, di balik antarmuka identity provisioning.' },
      },
      {
        id: 'ADR-004',
        title: { en: 'AI providers behind one interface, mock by default', id: 'Penyedia AI di balik satu antarmuka, tiruan secara bawaan' },
        summary: { en: 'The Application layer knows one AI interface; the provider is chosen by configuration. The mock is the default, so demos and tests cost nothing and as little school data as possible leaves the machine.', id: 'Lapisan Application hanya mengenal satu antarmuka AI; penyedianya dipilih lewat konfigurasi. Tiruan adalah bawaan, sehingga demo dan tes tidak berbiaya dan data sekolah sesedikit mungkin keluar dari mesin.' },
      },
      {
        id: 'ADR-005',
        title: { en: 'One VPS behind Caddy, and documents generated from the code', id: 'Satu VPS di belakang Caddy, dan dokumen dihasilkan dari kode' },
        summary: { en: 'Caddy ends TLS for the app and for Keycloak on separate addresses. The API reference, authorization matrix, jobs and real-time events, and the ERD are generated from the code and checked, so they cannot silently fall behind.', id: 'Caddy mengakhiri TLS untuk aplikasi dan Keycloak di alamat terpisah. Referensi API, matriks otorisasi, job dan event real-time, serta ERD dihasilkan dari kode dan diperiksa, sehingga tidak bisa diam-diam tertinggal.' },
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
    docs: [],
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
    links: [],
  },
  {
    slug: 'coffee-roasto',
    title: { en: 'Coffee Roasto: Coffee Roaster Monitoring and Control', id: 'Coffee Roasto: Pemantauan dan Kendali Mesin Sangrai Kopi' },
    summary: {
      en: 'A Windows app and Arduino firmware that monitor a drum coffee roaster and roast automatically by following a reference temperature profile with a PID controller. It started as my undergraduate thesis and is shown here in its v2.0 rewrite on .NET 10.',
      id: 'Aplikasi Windows dan firmware Arduino yang memantau mesin sangrai kopi drum dan menyangrai otomatis dengan mengikuti profil suhu acuan memakai pengendali PID. Berawal dari skripsi saya dan ditampilkan di sini dalam versi 2.0 yang ditulis ulang di .NET 10.',
    },
    state: 'done',
    status: {
      en: 'Version 2.0 is built and tested without a roaster (32 unit tests and a firmware simulation). Its first real roast still needs the burner-disconnected checklist; the original version is the thesis system.',
      id: 'Versi 2.0 sudah dibangun dan diuji tanpa mesin sangrai (32 tes unit dan simulasi firmware). Sangrai nyata pertamanya masih membutuhkan daftar periksa dengan pembakar dilepas; versi aslinya adalah sistem skripsi.',
    },
    role: { en: 'Author of the thesis system (v1.0) and of the v2.0 rewrite', id: 'Penulis sistem skripsi (v1.0) dan penulisan ulang v2.0' },
    year: '2026',
    tags: ['embedded', 'desktop'],
    cardStack: ['.NET 10', 'WPF', 'WPF-UI', 'ScottPlot', 'Arduino', 'PID control'],
    overview: {
      en: [
        'Roasting by hand depends on the operator’s eye and timing, the temperature is not recorded, and two roasts of the same beans rarely match. The roaster needs temperature measurement, repeatable control and a record of every run.',
        'Coffee Roasto has two programs joined by one USB serial cable. An Arduino reads two thermocouples and drives the burner, drum motor, blower, cooler and gas valve, and runs the PID loop. The Windows app shows the temperatures live, records them, and sends the reference profile. Version 1.0 was a Windows Forms app on .NET Framework; version 2.0 is a new Fluent-style app on .NET 10 with the logic moved out of the window so it can be tested.',
      ],
      id: [
        'Menyangrai manual bergantung pada mata dan ketepatan waktu operator, suhu tidak tercatat, dan dua sangrai dari biji yang sama jarang hasilnya sama. Mesin membutuhkan pengukuran suhu, kendali yang dapat diulang, dan catatan setiap proses.',
        'Coffee Roasto terdiri dari dua program yang dihubungkan satu kabel serial USB. Arduino membaca dua termokopel, menggerakkan pembakar, motor drum, blower, pendingin, dan katup gas, serta menjalankan loop PID. Aplikasi Windows menampilkan suhu secara langsung, merekamnya, dan mengirim profil acuan. Versi 1.0 adalah aplikasi Windows Forms di .NET Framework; versi 2.0 adalah aplikasi baru bergaya Fluent di .NET 10 dengan logika dipindah keluar dari jendela agar dapat diuji.',
      ],
    },
    roles: [
      { name: { en: 'Operator', id: 'Operator' }, needs: { en: 'Connects, controls every output by hand, loads a profile, records a roast and exports it. There is no login.', id: 'Menyambung, mengendalikan setiap keluaran secara manual, memuat profil, merekam sangrai, dan mengekspornya. Tidak ada login.' } },
    ],
    features: [
      { id: 'FR-1', title: { en: 'Connection', id: 'Koneksi' }, note: { en: 'Pick a COM port and connect; every control stays disabled until the port is open.', id: 'Pilih port COM dan sambungkan; semua kontrol nonaktif sampai port terbuka.' } },
      { id: 'FR-4', title: { en: 'Live monitoring', id: 'Pemantauan langsung' }, note: { en: 'A chart of bean, drum and reference temperature, plus the bean minus reference difference and the rate of rise in °C per minute.', id: 'Grafik suhu biji, drum, dan acuan, ditambah selisih biji terhadap acuan dan laju kenaikan dalam °C per menit.' } },
      { id: 'FR-6', title: { en: 'Manual control', id: 'Kendali manual' }, note: { en: 'Burner, drum motor, blower, cooler and gas valve, each with a lamp that shows its state.', id: 'Pembakar, motor drum, blower, pendingin, dan katup gas, masing-masing dengan lampu penanda status.' } },
      { id: 'FR-8', title: { en: 'Heating mode', id: 'Mode pemanasan' }, note: { en: 'Pre-heats the drum to 150 °C for 10 minutes.', id: 'Memanaskan drum hingga 150 °C selama 10 menit.' } },
      { id: 'FR-9', title: { en: 'Automatic roasting', id: 'Sangrai otomatis' }, note: { en: 'Follows a reference profile loaded from an Excel file, with a safety stop at 250 °C and a toast when the roast is finished.', id: 'Mengikuti profil acuan dari berkas Excel, dengan henti pengaman pada 250 °C dan notifikasi saat sangrai selesai.' } },
      { id: 'FR-14', title: { en: 'Recording and export', id: 'Perekaman dan ekspor' }, note: { en: 'Record a session and export it to .xlsx; Excel does not have to be installed.', id: 'Rekam sesi dan ekspor ke .xlsx; Excel tidak perlu terpasang.' } },
      { id: 'FR-16', title: { en: 'Status lamps and themes', id: 'Lampu status dan tema' }, note: { en: 'Lamps for every output and mode, and a light and dark theme that the chart follows.', id: 'Lampu untuk setiap keluaran dan mode, serta tema terang dan gelap yang diikuti grafik.' } },
    ],
    aiFeatures: [],
    architecture: {
      intro: {
        en: 'A supervisory GUI plus an embedded controller. The Arduino firmware owns the real-time control loop and the safety rules; the Windows app supervises, plots and records. The app is a screenless Core library, a view model and a thin WPF window, so the logic can be tested without a window.',
        id: 'GUI pengawas ditambah pengendali tertanam. Firmware Arduino memegang loop kendali real-time dan aturan keselamatan; aplikasi Windows mengawasi, menggambar grafik, dan merekam. Aplikasi terdiri dari pustaka Core tanpa layar, view model, dan jendela WPF yang tipis, sehingga logikanya dapat diuji tanpa jendela.',
      },
      diagrams: [
        {
          title: { en: 'System context', id: 'Konteks sistem' },
          def: {
            nodes: [
              { id: 'operator', label: 'Operator', col: 0, row: 1, kind: 'client' },
              { id: 'profile', label: 'Excel profile (in)', col: 1, row: 0, kind: 'data' },
              { id: 'gui', label: 'Coffee Roasto v2.0: WPF app on .NET 10', col: 1, row: 1, kind: 'service' },
              { id: 'export', label: 'Excel export (out)', col: 1, row: 2, kind: 'data' },
              { id: 'fw', label: 'Arduino firmware: sensors, PID, relays', col: 2, row: 1, kind: 'service' },
              { id: 'roaster', label: 'Roaster: burner, drum, blower, cooler, gas valve', col: 3, row: 1, kind: 'external' },
            ],
            edges: [
              { from: 'operator', to: 'gui' },
              { from: 'profile', to: 'gui', label: 'reference temperatures' },
              { from: 'gui', to: 'export', label: '.xlsx' },
              { from: 'gui', to: 'fw', label: 'USB serial, 9600 baud' },
              { from: 'fw', to: 'roaster' },
            ],
          },
        },
        {
          title: { en: 'Application layers (dependencies point one way)', id: 'Lapisan aplikasi (dependensi satu arah)' },
          def: {
            nodes: [
              { id: 'window', label: 'MainWindow (WPF)', col: 0, row: 1, kind: 'client' },
              { id: 'vm', label: 'MainViewModel', col: 1, row: 1, kind: 'service' },
              { id: 'core', label: 'CoffeeRoasto.Core', col: 2, row: 1, kind: 'data' },
              { id: 'fw', label: 'Arduino firmware', col: 3, row: 1, kind: 'external' },
            ],
            edges: [
              { from: 'window', to: 'vm', label: 'binds' },
              { from: 'vm', to: 'core' },
              { from: 'core', to: 'fw', label: 'serial' },
            ],
          },
        },
      ],
      layers: [
        { name: 'CoffeeRoasto.Core', does: { en: 'The logic without a screen: serial link, frame parser, profile reader and transmitter, recording and Excel export.', id: 'Logika tanpa layar: koneksi serial, parser frame, pembaca dan pengirim profil, perekaman, dan ekspor Excel.' }, dependsOn: { en: 'Nothing (no WPF reference)', id: 'Tidak ada (tanpa referensi WPF)' } },
        { name: 'MainViewModel', does: { en: 'Everything the window shows and every command behind a button; moves serial lines to the UI thread.', id: 'Semua yang ditampilkan jendela dan setiap perintah di balik tombol; memindahkan baris serial ke thread UI.' }, dependsOn: { en: 'Core', id: 'Core' } },
        { name: 'MainWindow', does: { en: 'The Fluent window: layout, ScottPlot chart, file dialogs, toasts and the theme switch.', id: 'Jendela Fluent: tata letak, grafik ScottPlot, dialog berkas, toast, dan pengalih tema.' }, dependsOn: { en: 'MainViewModel', id: 'MainViewModel' } },
        { name: 'Arduino firmware', does: { en: 'One tab per job: sensors, PID, actuators, and the manual, heating and PID modes.', id: 'Satu tab per tugas: sensor, PID, aktuator, serta mode manual, pemanasan, dan PID.' }, dependsOn: { en: 'The serial protocol only', id: 'Hanya protokol serial' } },
      ],
    },
    qualityGoals: [
      { goal: { en: 'Safety', id: 'Keselamatan' }, target: { en: 'The burner never stays on after a stop or an over-temperature', id: 'Pembakar tidak pernah tetap menyala setelah berhenti atau suhu berlebih' }, response: { en: 'Relays idle off, an `s` stop command, and a hard stop at 250 °C in the firmware', id: 'Relai mati saat diam, perintah henti `s`, dan henti keras pada 250 °C di firmware' } },
      { goal: { en: 'Control quality', id: 'Kualitas kendali' }, target: { en: 'The bean temperature follows the profile', id: 'Suhu biji mengikuti profil' }, response: { en: 'PID on the board, with the set point updated about every 4 s', id: 'PID di board, dengan set point diperbarui sekitar tiap 4 detik' } },
      { goal: { en: 'Responsiveness', id: 'Responsivitas' }, target: { en: 'A new reading is shown within a second of arriving', id: 'Pembacaan baru tampil dalam satu detik sejak tiba' }, response: { en: 'A serial event, then a hand-over to the UI thread', id: 'Event serial, lalu diserahkan ke thread UI' } },
      { goal: { en: 'Robustness', id: 'Ketahanan' }, target: { en: 'The app never crashes on a bad frame or an unplugged cable', id: 'Aplikasi tidak pernah crash karena frame rusak atau kabel dicabut' }, response: { en: 'Parsing and serial writes are guarded, and a damaged frame is ignored', id: 'Parsing dan penulisan serial dijaga, dan frame rusak diabaikan' } },
      { goal: { en: 'Simplicity', id: 'Kesederhanaan' }, target: { en: 'The operator needs no setup beyond the COM port', id: 'Operator tidak perlu pengaturan selain port COM' }, response: { en: 'One window, one button per action, one .exe without an installer', id: 'Satu jendela, satu tombol per aksi, satu .exe tanpa installer' } },
      { goal: { en: 'Maintainability', id: 'Kemudahan perawatan' }, target: { en: 'Both sides can be read by students', id: 'Kedua sisi dapat dibaca mahasiswa' }, response: { en: 'A single-character protocol, a screenless Core, and one small firmware tab per job', id: 'Protokol satu karakter, Core tanpa layar, dan satu tab firmware kecil per tugas' } },
    ],
    design: [
      {
        title: { en: 'Control loop (PID on the Arduino)', id: 'Loop kendali (PID di Arduino)' },
        body: {
          en: [
            'The PID runs on the board, not in the app, so a steady 1 s sampling period and the safety rules do not depend on Windows timers or on a PC that may hang (ADR-002). The set point comes from an Excel profile, sent in groups of ten values, one value per averaged reading (about 4 s).',
            'The output is limited to 0 to 40. It drives the gas-valve servo (angle = 40 − PID) and the burner relay, which switches on at 40 and off at 0 and keeps its state in between, so the relay does not chatter. A bean temperature of 250 °C or more stops the loop by itself.',
            'The repository is open about the limits of the implemented controller: the integral and derivative terms are not fully active, so in practice it acts as a proportional controller with a narrow band of about 1.8 °C. This follows from reading the code and has not been measured on a real roast with v2.0.',
          ],
          id: [
            'PID berjalan di board, bukan di aplikasi, sehingga periode sampling 1 detik yang stabil dan aturan keselamatan tidak bergantung pada timer Windows atau PC yang bisa hang (ADR-002). Set point berasal dari profil Excel, dikirim dalam kelompok sepuluh nilai, satu nilai per pembacaan rata-rata (sekitar 4 detik).',
            'Keluarannya dibatasi 0 sampai 40. Keluaran itu menggerakkan servo katup gas (sudut = 40 − PID) dan relai pembakar, yang menyala pada 40 dan mati pada 0 serta mempertahankan statusnya di antaranya, sehingga relai tidak bergetar. Suhu biji 250 °C atau lebih menghentikan loop dengan sendirinya.',
            'Repositori terbuka soal batas pengendali yang diimplementasikan: suku integral dan derivatif tidak sepenuhnya aktif, sehingga dalam praktik ia bekerja sebagai pengendali proporsional dengan pita sempit sekitar 1,8 °C. Ini berasal dari pembacaan kode dan belum diukur pada sangrai nyata dengan v2.0.',
          ],
        },
      },
      {
        title: { en: 'Serial protocol and threading', id: 'Protokol serial dan threading' },
        body: {
          en: [
            'Commands from the app are single ASCII characters; the Arduino answers with a text frame, `@bean A drum B reference C`, about every 4 s, and single-letter events for the burner, the end of heating and the end of a roast (ADR-001). It is trivial to parse on a small board and can be tested by hand from the serial monitor.',
            'The serial thread only reads lines. The view model moves each line to the UI thread before it parses the values with the invariant culture and updates the screen, so the result does not depend on the regional settings of the PC. Every command goes through one send method that checks the port is open.',
          ],
          id: [
            'Perintah dari aplikasi berupa satu karakter ASCII; Arduino menjawab dengan frame teks, `@bean A drum B reference C`, sekitar tiap 4 detik, serta event satu huruf untuk pembakar, akhir pemanasan, dan akhir sangrai (ADR-001). Mudah diurai di board kecil dan dapat diuji manual dari serial monitor.',
            'Thread serial hanya membaca baris. View model memindahkan setiap baris ke thread UI sebelum mengurai nilainya dengan invariant culture dan memperbarui layar, sehingga hasilnya tidak bergantung pada pengaturan regional PC. Setiap perintah melewati satu metode kirim yang memeriksa port terbuka.',
          ],
        },
      },
      {
        title: { en: 'Temperature measurement', id: 'Pengukuran suhu' },
        body: {
          en: [
            'Two MAX6675 amplifiers with K-type thermocouples measure the drum and the beans. Their readings are 12-bit (0.25 °C steps), noisy and offset, so the firmware takes four samples one second apart, averages them, corrects each channel with a linear regression measured against a reference thermometer, and ignores changes smaller than 0.25 °C (ADR-004).',
            'The cost is a 4 s update period, which is acceptable for a slow thermal system. Replacing a probe or an amplifier means measuring a new regression.',
          ],
          id: [
            'Dua penguat MAX6675 dengan termokopel tipe K mengukur drum dan biji. Pembacaannya 12-bit (langkah 0,25 °C), berderau, dan bergeser, sehingga firmware mengambil empat sampel berjarak satu detik, merata-ratakannya, mengoreksi tiap kanal dengan regresi linear yang diukur terhadap termometer acuan, dan mengabaikan perubahan di bawah 0,25 °C (ADR-004).',
            'Harganya adalah periode pembaruan 4 detik, yang dapat diterima untuk sistem termal yang lambat. Mengganti probe atau penguat berarti mengukur regresi baru.',
          ],
        },
      },
      {
        title: { en: 'Testing without a roaster', id: 'Pengujian tanpa mesin sangrai' },
        body: {
          en: [
            'There are 32 xUnit tests for the Core library and the view model. The firmware is tested on the PC: the real sketch is compiled together with a small stand-in for the Arduino core and a virtual clock, so a 29-minute roast runs in under a second and gives the same result every time.',
            'Twelve scripted scenarios are compared with traces recorded from the original firmware. The restructured firmware reproduces all of them, which is the evidence that the refactor did not change behaviour, and a deliberate change to the PID formula was caught. The same tooling drives the real window to make the screenshots below.',
            'What is not tested is stated: the real roaster (relays, servo, thermocouples, the thermal behaviour) and the serial link itself.',
          ],
          id: [
            'Ada 32 tes xUnit untuk pustaka Core dan view model. Firmware diuji di PC: sketch aslinya dikompilasi bersama pengganti kecil untuk inti Arduino dan jam virtual, sehingga sangrai 29 menit berjalan dalam kurang dari satu detik dan hasilnya selalu sama.',
            'Dua belas skenario berskrip dibandingkan dengan jejak yang direkam dari firmware asli. Firmware yang disusun ulang mereproduksi semuanya, yang menjadi bukti bahwa refactor tidak mengubah perilaku, dan perubahan sengaja pada rumus PID berhasil terdeteksi. Perangkat yang sama menggerakkan jendela asli untuk membuat tangkapan layar di bawah.',
            'Yang tidak diuji dinyatakan: mesin sangrai nyata (relai, servo, termokopel, perilaku termal) dan koneksi serial itu sendiri.',
          ],
        },
      },
      {
        title: { en: 'Known limitations', id: 'Keterbatasan yang diketahui' },
        body: {
          en: [
            'The project documents where its code and its intent differ, so nobody is surprised: the PID gains from the MATLAB simulation are not fully applied; the app has an auto mode button that the firmware does not handle; a command without a newline arrives after a one-second read timeout; profile sending has no cancel button; and a profile whose length is a multiple of ten does not end by itself. One draft sketch (a servo ramp) does not compile and is not used.',
          ],
          id: [
            'Proyek mendokumentasikan di mana kode dan maksudnya berbeda, agar tidak ada yang terkejut: gain PID dari simulasi MATLAB tidak sepenuhnya diterapkan; aplikasi punya tombol mode otomatis yang tidak ditangani firmware; perintah tanpa baris baru tiba setelah timeout baca satu detik; pengiriman profil tidak punya tombol batal; dan profil yang panjangnya kelipatan sepuluh tidak berakhir sendiri. Satu sketsa draf (rampa servo) tidak dapat dikompilasi dan tidak dipakai.',
          ],
        },
      },
    ],
    dataModules: [],
    decisions: [
      { id: 'ADR-001', title: { en: 'Single-character serial protocol', id: 'Protokol serial satu karakter' }, summary: { en: 'Commands are single ASCII characters and the board answers with a text frame. Trivial to parse and test by hand, but with no error detection.', id: 'Perintah berupa satu karakter ASCII dan board menjawab dengan frame teks. Mudah diurai dan diuji manual, tetapi tanpa deteksi kesalahan.' } },
      { id: 'ADR-002', title: { en: 'PID control runs on the Arduino', id: 'Kendali PID berjalan di Arduino' }, summary: { en: 'A steady sampling period and safety that does not depend on the PC; the cost is that tuning means re-flashing the board.', id: 'Periode sampling stabil dan keselamatan yang tidak bergantung pada PC; harganya, penyetelan berarti mem-flash ulang board.' } },
      { id: 'ADR-003', title: { en: 'Excel files for profiles and exports', id: 'Berkas Excel untuk profil dan ekspor' }, summary: { en: 'Operators already plan roasts in spreadsheets. ExcelDataReader and ClosedXML work without Excel installed.', id: 'Operator sudah merencanakan sangrai di spreadsheet. ExcelDataReader dan ClosedXML bekerja tanpa Excel terpasang.' } },
      { id: 'ADR-004', title: { en: 'Averaging, regression correction and a dead band', id: 'Perataan, koreksi regresi, dan dead band' }, summary: { en: 'Four samples averaged, each channel corrected against a reference thermometer, and changes below 0.25 °C ignored.', id: 'Empat sampel dirata-ratakan, tiap kanal dikoreksi terhadap termometer acuan, dan perubahan di bawah 0,25 °C diabaikan.' } },
      { id: 'ADR-005', title: { en: 'Windows Forms on .NET Framework with ClickOnce (v1.0, superseded)', id: 'Windows Forms di .NET Framework dengan ClickOnce (v1.0, digantikan)' }, summary: { en: 'The original choice: everything in the framework and an installer from a folder or a USB stick, but no automated tests because the logic sat in the form.', id: 'Pilihan awal: semua ada di framework dan installer dari folder atau USB, tetapi tanpa tes otomatis karena logikanya ada di form.' } },
      { id: 'ADR-006', title: { en: 'WPF with WPF-UI on .NET 10, a screenless Core and a single-file exe', id: 'WPF dengan WPF-UI di .NET 10, Core tanpa layar, dan exe satu berkas' }, summary: { en: 'A real Fluent look with a light and dark theme, a modern chart, logic that is covered by tests, correct high-DPI, and one self-contained file for a machine that is often offline.', id: 'Tampilan Fluent sungguhan dengan tema terang dan gelap, grafik modern, logika yang tercakup tes, high-DPI yang benar, dan satu berkas mandiri untuk mesin yang sering offline.' } },
    ],
    stackGroups: [
      { group: { en: 'Desktop app', id: 'Aplikasi desktop' }, items: ['C#', '.NET 10', 'WPF', 'WPF-UI 4 (Fluent)', 'ScottPlot 5', 'CommunityToolkit.Mvvm', 'System.IO.Ports'] },
      { group: { en: 'Files and Excel', id: 'Berkas dan Excel' }, items: ['ClosedXML', 'ExcelDataReader'] },
      { group: { en: 'Firmware and hardware', id: 'Firmware dan perangkat keras' }, items: ['Arduino (C++)', 'MAX6675 library', 'Servo library', 'MAX6675 amplifiers', 'K-type thermocouples', 'Relays', 'USB serial, 9600 baud', 'PID control'] },
      { group: { en: 'Testing', id: 'Pengujian' }, items: ['xUnit', 'Firmware simulation with golden traces', 'arduino-cli', 'Screenshot tool'] },
      { group: { en: 'Delivery', id: 'Pengiriman' }, items: ['Self-contained single-file exe', 'PowerShell check script'] },
    ],
    highlights: {
      en: [
        'A Fluent WPF app with a light and dark theme and a live chart of bean, drum and reference temperature, with bean minus reference and the rate of rise on tiles.',
        'Automatic roasting that follows an Excel profile with a PID loop on the Arduino, so the safety rules hold even if the PC hangs.',
        'Recording and export to .xlsx without Excel installed.',
        '32 unit tests and a firmware simulation of 12 scenarios compared with traces of the original firmware, which shows the rewrite did not change behaviour.',
        'One self-contained .exe of about 74 MB: no installer and no .NET on the roaster PC.',
        'Documentation in English and Indonesian: requirements written back from the code, system design, six decision records, the serial protocol, a hardware guide and a list of known limitations.',
      ],
      id: [
        'Aplikasi WPF Fluent dengan tema terang dan gelap serta grafik langsung suhu biji, drum, dan acuan, dengan selisih biji terhadap acuan dan laju kenaikan pada ubin.',
        'Sangrai otomatis yang mengikuti profil Excel dengan loop PID di Arduino, sehingga aturan keselamatan tetap berlaku walau PC hang.',
        'Perekaman dan ekspor ke .xlsx tanpa Excel terpasang.',
        '32 tes unit dan simulasi firmware 12 skenario yang dibandingkan dengan jejak firmware asli, yang menunjukkan penulisan ulang tidak mengubah perilaku.',
        'Satu .exe mandiri sekitar 74 MB: tanpa installer dan tanpa .NET di PC mesin sangrai.',
        'Dokumentasi dalam bahasa Inggris dan Indonesia: kebutuhan yang ditulis balik dari kode, desain sistem, enam catatan keputusan, protokol serial, panduan perangkat keras, dan daftar keterbatasan yang diketahui.',
      ],
    },
    docs: [],
    phases: [],
    gallery: [
      { kind: 'flow', file: 'flows/pid-roast.gif', width: 1100, height: 695, caption: { en: 'A whole 29-minute roast replayed through the real window: the bean temperature follows the reference', id: 'Satu sangrai penuh 29 menit diputar ulang lewat jendela asli: suhu biji mengikuti acuan' } },
      { kind: 'shot', file: 'screenshots/01-start.png', width: 2040, height: 1290, caption: { en: 'Start screen: everything is off until Connect', id: 'Layar awal: semua mati sampai Connect' } },
      { kind: 'shot', file: 'screenshots/02-connected.png', width: 2040, height: 1290, caption: { en: 'Connected: the control cards are on and a COM port is chosen', id: 'Tersambung: kartu kontrol aktif dan port COM dipilih' } },
      { kind: 'shot', file: 'screenshots/03-profile-loaded.png', width: 2040, height: 1290, caption: { en: 'A reference profile loaded from Excel into the data card', id: 'Profil acuan dari Excel dimuat ke kartu data' } },
      { kind: 'shot', file: 'screenshots/04-pid-running-05min.png', width: 2040, height: 1290, caption: { en: 'PID mode after 5 minutes', id: 'Mode PID setelah 5 menit' } },
      { kind: 'shot', file: 'screenshots/04-pid-running-15min.png', width: 2040, height: 1290, caption: { en: 'PID mode after 15 minutes: the bean follows the reference, with the difference and rate of rise on the tiles', id: 'Mode PID setelah 15 menit: biji mengikuti acuan, dengan selisih dan laju kenaikan pada ubin' } },
      { kind: 'shot', file: 'screenshots/05-roast-finished.png', width: 2040, height: 1290, caption: { en: 'Roast finished: the recording is in the data card and a toast says so', id: 'Sangrai selesai: rekaman ada di kartu data dan toast memberi tahu' } },
      { kind: 'shot', file: 'screenshots/06-dark-theme.png', width: 2040, height: 1290, caption: { en: 'The same screen in the dark theme', id: 'Layar yang sama dalam tema gelap' } },
      { kind: 'shot', file: 'diagrams/pid-characteristic.svg', width: 780, height: 700, caption: { en: 'How the controller reacts to the temperature error: PID output, valve angle and burner state (the labels in the diagram are in English)', id: 'Cara pengendali bereaksi terhadap galat suhu: keluaran PID, sudut katup, dan status pembakar (label pada diagram berbahasa Inggris)' } },
    ],
    links: [],
  },
  {
    slug: 'linewise',
    title: { en: 'LineWise: Manufacturing Operations and Quality Management System', id: 'LineWise: Sistem Manajemen Operasi dan Kualitas Manufaktur' },
    summary: {
      en: 'Production orders, work orders, quality inspections, defect handling, approvals, KPI dashboards and an audit trail in one platform for a mid-to-large manufacturing plant. A portfolio project built on simulated data only, with an Angular front end and an ASP.NET Core API on PostgreSQL.',
      id: 'Order produksi, work order, inspeksi kualitas, penanganan cacat, persetujuan, dashboard KPI, dan jejak audit dalam satu platform untuk pabrik manufaktur menengah hingga besar. Proyek portofolio yang hanya memakai data simulasi, dengan front end Angular dan API ASP.NET Core di atas PostgreSQL.',
    },
    state: 'done',
    status: {
      en: 'All phases (0 to 9) are built and tested. A production Docker Compose package passes a 20-check smoke test from empty volumes; there is no hosted demo yet. Demo by Muhammad Ridhwan Habib Abdillah, on fictional data.',
      id: 'Semua fase (0 sampai 9) sudah dibangun dan diuji. Paket produksi Docker Compose lolos smoke test 20 pemeriksaan dari volume kosong; belum ada demo yang di-host. Demo oleh Muhammad Ridhwan Habib Abdillah, dengan data fiktif.',
    },
    role: { en: 'System Architect, System Design and Author (Muhammad Ridhwan Habib Abdillah), assisted by Claude', id: 'Arsitek Sistem, Desain Sistem, dan Penulis (Muhammad Ridhwan Habib Abdillah), dibantu Claude' },
    year: '2026',
    tags: ['angular', 'aspnet', 'data'],
    cardStack: ['Angular', 'ASP.NET Core', 'PostgreSQL', 'Keycloak', 'Docker'],
    overview: {
      en: [
        'In a plant, production output, quality checks and defects often live in separate spreadsheets and paper forms, so a defect is found late, a decision is hard to trace, and nobody can say who changed what. LineWise puts the whole chain in one system: a planner releases an order, operators record output, inspectors fill a checklist, a failed check raises its defect, and serious decisions need two approvals.',
        'It is built for one plant with seven roles. The API is a modular monolith with Clean Architecture, and it is also the backend-for-frontend of Keycloak, so the browser holds only an HttpOnly session cookie. Every protected operation is checked in the backend, submitted records are append-only, and an audit trail records every change. The dashboard figures are calculated from the stored records, not typed in.',
      ],
      id: [
        'Di pabrik, output produksi, pemeriksaan kualitas, dan cacat sering tersebar di spreadsheet dan formulir kertas, sehingga cacat ditemukan terlambat, keputusan sulit ditelusuri, dan tidak ada yang tahu siapa mengubah apa. LineWise menyatukan seluruh rantainya: planner merilis order, operator mencatat output, inspektur mengisi daftar periksa, pemeriksaan yang gagal memunculkan cacatnya, dan keputusan penting membutuhkan dua persetujuan.',
        'Sistem ini dibuat untuk satu pabrik dengan tujuh peran. API-nya adalah modular monolith dengan Clean Architecture sekaligus backend-for-frontend untuk Keycloak, sehingga browser hanya memegang cookie sesi HttpOnly. Setiap operasi terlindungi diperiksa di backend, rekaman yang sudah dikirim bersifat append-only, dan jejak audit mencatat setiap perubahan. Angka dashboard dihitung dari data yang tersimpan, bukan diketik.',
      ],
    },
    roles: [
      { name: { en: 'System Administrator', id: 'System Administrator' }, needs: { en: 'Manages accounts, roles, master data and the permission matrix.', id: 'Mengelola akun, peran, data master, dan matriks izin.' } },
      { name: { en: 'Production Planner', id: 'Production Planner' }, needs: { en: 'Creates, releases and monitors production orders and their work orders.', id: 'Membuat, merilis, dan memantau order produksi beserta work order-nya.' } },
      { name: { en: 'Production Operator', id: 'Production Operator' }, needs: { en: 'Records good and rejected output on a work order, on a tablet or laptop.', id: 'Mencatat output baik dan reject pada work order, di tablet atau laptop.' } },
      { name: { en: 'QC Inspector', id: 'QC Inspector' }, needs: { en: 'Performs checklist inspections; a failed one raises its defect.', id: 'Melakukan inspeksi berbasis daftar periksa; inspeksi yang gagal memunculkan cacatnya.' } },
      { name: { en: 'QC Supervisor', id: 'QC Supervisor' }, needs: { en: 'Reviews defects, sets the disposition and corrective actions, and approves the first step.', id: 'Meninjau cacat, menetapkan disposisi dan tindakan korektif, dan menyetujui langkah pertama.' } },
      { name: { en: 'Production Supervisor', id: 'Production Supervisor' }, needs: { en: 'Follows output, status and exceptions, and can put an order on hold.', id: 'Memantau output, status, dan pengecualian, serta dapat menahan order.' } },
      { name: { en: 'Management', id: 'Management' }, needs: { en: 'Reads KPIs, trends and reports, and gives the second approval.', id: 'Membaca KPI, tren, dan laporan, serta memberi persetujuan kedua.' } },
    ],
    features: [
      { id: 'FR-01', title: { en: 'Sign-in with Keycloak', id: 'Masuk dengan Keycloak' }, note: { en: 'OpenID Connect through the API as backend-for-frontend; the browser holds only an HttpOnly cookie, with antiforgery and a rate limit.', id: 'OpenID Connect lewat API sebagai backend-for-frontend; browser hanya memegang cookie HttpOnly, dengan antiforgery dan pembatasan laju.' } },
      { id: 'FR-02', title: { en: 'Users, roles and permissions', id: 'Pengguna, peran, dan izin' }, note: { en: 'Seven roles and a permission matrix that administrators can edit, enforced on every endpoint.', id: 'Tujuh peran dan matriks izin yang dapat diubah administrator, diberlakukan di setiap endpoint.' } },
      { id: 'FR-03', title: { en: 'Master data', id: 'Data master' }, note: { en: 'Products, lines, workstations and defect categories with unique codes; deactivated, never deleted.', id: 'Produk, lini, workstation, dan kategori cacat dengan kode unik; dinonaktifkan, tidak pernah dihapus.' } },
      { id: 'FR-04', title: { en: 'Production orders', id: 'Order produksi' }, note: { en: 'A lifecycle of release, hold, resume, complete, cancel and reopen, with filters and progress.', id: 'Siklus rilis, tahan, lanjut, selesai, batal, dan buka kembali, dengan filter dan progres.' } },
      { id: 'FR-05', title: { en: 'Work orders and output tracking', id: 'Work order dan pelacakan output' }, note: { en: 'Output records are append-only; a mistake is fixed by an adjustment, with an output limit and idempotent writes.', id: 'Rekaman output bersifat append-only; kesalahan dikoreksi lewat penyesuaian, dengan batas output dan penulisan idempoten.' } },
      { id: 'FR-06', title: { en: 'Quality inspections', id: 'Inspeksi kualitas' }, note: { en: 'Versioned checklist templates per product; the template rule decides the result.', id: 'Template daftar periksa berversi per produk; aturan template menentukan hasilnya.' } },
      { id: 'FR-07', title: { en: 'Defect management', id: 'Manajemen cacat' }, note: { en: 'A failed inspection raises its defect in one transaction; review, disposition, corrective actions with owner and due date.', id: 'Inspeksi yang gagal memunculkan cacatnya dalam satu transaksi; tinjauan, disposisi, tindakan korektif dengan pemilik dan tenggat.' } },
      { id: 'FR-08', title: { en: 'Two-step approval', id: 'Persetujuan dua langkah' }, note: { en: 'Closing a scrap or use-as-is defect and reopening a completed order need two approvers, with segregation of duties.', id: 'Menutup cacat scrap atau use-as-is dan membuka kembali order selesai membutuhkan dua penyetuju, dengan pemisahan tugas.' } },
      { id: 'FR-09', title: { en: 'KPI dashboard', id: 'Dashboard KPI' }, note: { en: 'Defect rate, inspection pass rate and production achievement from aggregation queries, with filters and N/A for a zero denominator.', id: 'Tingkat cacat, tingkat lolos inspeksi, dan pencapaian produksi dari query agregasi, dengan filter dan N/A untuk penyebut nol.' } },
      { id: 'FR-10', title: { en: 'Search, filters and CSV export', id: 'Pencarian, filter, dan ekspor CSV' }, note: { en: 'Streamed CSV that follows the active filters and the user’s permissions.', id: 'CSV yang dialirkan dan mengikuti filter aktif serta izin pengguna.' } },
      { id: 'FR-11', title: { en: 'In-app notifications', id: 'Notifikasi dalam aplikasi' }, note: { en: 'Written in the same transaction as the event, with a bell and an unread count; a background job covers due dates.', id: 'Ditulis dalam transaksi yang sama dengan kejadiannya, dengan ikon lonceng dan jumlah belum dibaca; job latar menangani tenggat.' } },
      { id: 'FR-12', title: { en: 'Audit trail', id: 'Jejak audit' }, note: { en: 'An interceptor records changed fields only, never a secret; an Audit log screen and a timeline on orders, inspections and defects.', id: 'Interceptor mencatat hanya kolom yang berubah, tidak pernah rahasia; layar Audit log dan lini masa pada order, inspeksi, dan cacat.' } },
    ],
    aiFeatures: [],
    architecture: {
      intro: {
        en: 'A modular monolith: one deployable API with four layers, an Angular single-page app, Keycloak for identity and PostgreSQL for data, all behind a Caddy proxy in production. Dependencies point one way, and Domain depends on nothing.',
        id: 'Modular monolith: satu API yang dapat di-deploy dengan empat lapisan, aplikasi Angular satu halaman, Keycloak untuk identitas, dan PostgreSQL untuk data, semuanya di belakang proxy Caddy di produksi. Dependensi satu arah, dan Domain tidak bergantung pada apa pun.',
      },
      diagrams: [
        {
          title: { en: 'Containers (production package)', id: 'Kontainer (paket produksi)' },
          def: {
            nodes: [
              { id: 'browser', label: 'Browser: Angular SPA', col: 0, row: 1, kind: 'client' },
              { id: 'proxy', label: 'Caddy reverse proxy (HTTPS)', col: 1, row: 1, kind: 'service' },
              { id: 'api', label: 'api: ASP.NET Core .NET 10 (BFF)', col: 2, row: 0, kind: 'service' },
              { id: 'kc', label: 'Keycloak (OIDC)', col: 2, row: 2, kind: 'service' },
              { id: 'pg', label: 'PostgreSQL', col: 3, row: 0, kind: 'data' },
              { id: 'kcdb', label: 'PostgreSQL (Keycloak data)', col: 3, row: 2, kind: 'data' },
            ],
            edges: [
              { from: 'browser', to: 'proxy', label: 'HttpOnly cookie' },
              { from: 'proxy', to: 'api' },
              { from: 'proxy', to: 'kc', label: 'login pages' },
              { from: 'api', to: 'pg' },
              { from: 'api', to: 'kc', label: 'OIDC, users' },
              { from: 'kc', to: 'kcdb' },
            ],
          },
        },
        {
          title: { en: 'Backend layers (dependencies point one way)', id: 'Lapisan backend (dependensi satu arah)' },
          def: {
            nodes: [
              { id: 'api', label: 'Api', col: 0, row: 1, kind: 'client' },
              { id: 'infra', label: 'Infrastructure', col: 2, row: 0, kind: 'external' },
              { id: 'app', label: 'Application', col: 2, row: 2, kind: 'service' },
              { id: 'domain', label: 'Domain', col: 3, row: 2, kind: 'data' },
            ],
            edges: [
              { from: 'api', to: 'infra', label: 'DI wiring' },
              { from: 'api', to: 'app', label: 'calls use cases' },
              { from: 'infra', to: 'app', label: 'implements interfaces' },
              { from: 'app', to: 'domain' },
            ],
          },
        },
      ],
      layers: [
        { name: 'LineWise.Domain', does: { en: 'Entities, status rules and business invariants. No dependencies.', id: 'Entitas, aturan status, dan invarian bisnis. Tanpa dependensi.' }, dependsOn: { en: 'Nothing', id: 'Tidak ada' } },
        { name: 'LineWise.Application', does: { en: 'One folder per use case, validation and Result<T>. Reaches data only through IAppDbContext.', id: 'Satu folder per use case, validasi, dan Result<T>. Mengakses data hanya lewat IAppDbContext.' }, dependsOn: { en: 'Domain', id: 'Domain' } },
        { name: 'LineWise.Infrastructure', does: { en: 'EF Core with Npgsql, migrations, the audit interceptor, seeding and background jobs. PostgreSQL-specific code stays here.', id: 'EF Core dengan Npgsql, migrasi, interceptor audit, seeding, dan job latar. Kode khusus PostgreSQL tetap di sini.' }, dependsOn: { en: 'Application', id: 'Application' } },
        { name: 'LineWise.Api', does: { en: 'Minimal API endpoints, one file per feature, the Keycloak session, error envelope and security headers.', id: 'Endpoint Minimal API, satu berkas per fitur, sesi Keycloak, amplop error, dan header keamanan.' }, dependsOn: { en: 'Infrastructure, Application', id: 'Infrastructure, Application' } },
      ],
    },
    qualityGoals: [
      { goal: { en: 'Responsiveness', id: 'Responsivitas' }, target: { en: 'Common list and detail APIs at p95 under 500 ms', id: 'API daftar dan detail umum p95 di bawah 500 ms' }, response: { en: 'Measured on 100,000 output rows, with one covering index; the figures are recorded in ADR-016', id: 'Diukur pada 100.000 baris output, dengan satu covering index; angkanya tercatat di ADR-016' } },
      { goal: { en: 'Security and privacy', id: 'Keamanan dan privasi' }, target: { en: 'Backend authorization on every operation; no secrets in the repository', id: 'Otorisasi backend di setiap operasi; tidak ada rahasia di repositori' }, response: { en: '401 and 403 tests for every endpoint, security headers, HSTS, a CORS allowlist and a dependency scan in the CI', id: 'Tes 401 dan 403 untuk setiap endpoint, header keamanan, HSTS, allowlist CORS, dan pemindaian dependensi di CI' } },
      { goal: { en: 'Data integrity', id: 'Integritas data' }, target: { en: 'History is never lost', id: 'Riwayat tidak pernah hilang' }, response: { en: 'Append-only inspections and output, corrections by revision, void or adjustment, soft delete, and one transaction for multi-record steps', id: 'Inspeksi dan output append-only, koreksi lewat revisi, pembatalan, atau penyesuaian, soft delete, dan satu transaksi untuk langkah multi-rekaman' } },
      { goal: { en: 'Accessibility', id: 'Aksesibilitas' }, target: { en: 'WCAG AA on the critical screens', id: 'WCAG AA pada layar kritis' }, response: { en: 'axe runs in the end-to-end suite with no violation; Lighthouse 100 for accessibility on the login page and the dashboard', id: 'axe berjalan di suite end-to-end tanpa pelanggaran; Lighthouse 100 untuk aksesibilitas pada halaman login dan dashboard' } },
      { goal: { en: 'Testability', id: 'Kemampuan diuji' }, target: { en: 'Line coverage of at least 70% for Domain and Application', id: 'Cakupan baris minimal 70% untuk Domain dan Application' }, response: { en: 'Unit tests, integration tests on a real PostgreSQL with Testcontainers, and Playwright end-to-end tests; 94.5% measured', id: 'Tes unit, tes integrasi di PostgreSQL asli dengan Testcontainers, dan tes end-to-end Playwright; terukur 94,5%' } },
      { goal: { en: 'Operability', id: 'Kemudahan operasi' }, target: { en: 'A reviewer can run it from a clean machine', id: 'Peninjau dapat menjalankannya dari mesin bersih' }, response: { en: 'A Docker Compose package with a 20-check smoke test, backup and restore scripts, and published images', id: 'Paket Docker Compose dengan smoke test 20 pemeriksaan, skrip backup dan restore, dan image yang dipublikasikan' } },
    ],
    design: [
      {
        title: { en: 'Security and authorization', id: 'Keamanan dan otorisasi' },
        body: {
          en: [
            'The API is the backend-for-frontend of Keycloak (ADR-010): it runs the OpenID Connect flow, keeps the tokens on the server, and gives the browser only an HttpOnly session cookie, plus antiforgery and a login rate limit. Keycloak owns accounts, credentials and the seven roles; the application owns the permission catalog (35 permissions) and the editable role-to-permission matrix.',
            'Authorization is checked in the backend on every protected operation, by role and by the record itself. The front end hides what a role cannot use, but that is only a convenience. A user ID, a role or a permission is never read from a request body.',
          ],
          id: [
            'API adalah backend-for-frontend untuk Keycloak (ADR-010): ia menjalankan alur OpenID Connect, menyimpan token di server, dan hanya memberi browser cookie sesi HttpOnly, ditambah antiforgery dan pembatasan laju login. Keycloak memegang akun, kredensial, dan tujuh peran; aplikasi memegang katalog izin (35 izin) dan matriks peran-ke-izin yang dapat diubah.',
            'Otorisasi diperiksa di backend pada setiap operasi terlindungi, berdasarkan peran dan rekamannya sendiri. Front end menyembunyikan yang tidak boleh dipakai suatu peran, tetapi itu hanya kemudahan. ID pengguna, peran, atau izin tidak pernah dibaca dari body request.',
          ],
        },
      },
      {
        title: { en: 'Append-only records and the audit trail', id: 'Rekaman append-only dan jejak audit' },
        body: {
          en: [
            'Submitted inspections and production output are never deleted. A mistake goes through a revision, a void or an adjustment, each of which is recorded with who and when. An EF Core interceptor writes the audit log with the changed fields only and never a secret, and the screens show names instead of identifiers when the log is read.',
            'Output writes are idempotent, and a work order accepts output up to its planned quantity plus a configurable tolerance (10 percent by default), so a double click does not count twice.',
          ],
          id: [
            'Inspeksi yang sudah dikirim dan output produksi tidak pernah dihapus. Kesalahan lewat revisi, pembatalan, atau penyesuaian, yang masing-masing dicatat dengan siapa dan kapan. Interceptor EF Core menulis audit log dengan kolom yang berubah saja dan tidak pernah rahasia, dan layar menampilkan nama alih-alih identifier saat log dibaca.',
            'Penulisan output bersifat idempoten, dan work order menerima output hingga kuantitas rencana ditambah toleransi yang dapat diatur (10 persen secara bawaan), sehingga klik ganda tidak dihitung dua kali.',
          ],
        },
      },
      {
        title: { en: 'Inspections, defects and two-step approval', id: 'Inspeksi, cacat, dan persetujuan dua langkah' },
        body: {
          en: [
            'The template decides an inspection’s result: a required item that fails makes it FAIL, and otherwise up to a set number of failed items gives CONDITIONAL. A failed inspection raises its defect in the same transaction (ADR-013).',
            'Two actions need approval in two steps (ADR-014): closing a defect whose disposition is scrap or use-as-is, and reopening a completed order. When the last step approves, the system carries the action out in the same transaction. Segregation of duties stops a person from approving their own request.',
          ],
          id: [
            'Template menentukan hasil inspeksi: item wajib yang gagal membuatnya FAIL, selain itu sampai jumlah tertentu item gagal menghasilkan CONDITIONAL. Inspeksi yang gagal memunculkan cacatnya dalam transaksi yang sama (ADR-013).',
            'Dua aksi membutuhkan persetujuan dua langkah (ADR-014): menutup cacat berdisposisi scrap atau use-as-is, dan membuka kembali order yang selesai. Saat langkah terakhir menyetujui, sistem menjalankan aksinya dalam transaksi yang sama. Pemisahan tugas mencegah seseorang menyetujui permintaannya sendiri.',
          ],
        },
      },
      {
        title: { en: 'KPIs, reports and notifications', id: 'KPI, laporan, dan notifikasi' },
        body: {
          en: [
            'KPIs come from aggregation queries, not stored totals, and follow the date of their own event (ADR-015). A zero denominator shows N/A rather than a misleading zero. Charts use ECharts in a lazy-loaded chunk that loads only when the first chart is drawn.',
            'CSV export is streamed and follows the active filters and the user’s permissions. Notifications are written in the same transaction as the event and found by polling every 30 seconds.',
          ],
          id: [
            'KPI berasal dari query agregasi, bukan total tersimpan, dan mengikuti tanggal kejadiannya sendiri (ADR-015). Penyebut nol menampilkan N/A alih-alih nol yang menyesatkan. Grafik memakai ECharts dalam chunk yang dimuat malas dan baru dimuat saat grafik pertama digambar.',
            'Ekspor CSV dialirkan dan mengikuti filter aktif serta izin pengguna. Notifikasi ditulis dalam transaksi yang sama dengan kejadiannya dan ditemukan lewat polling tiap 30 detik.',
          ],
        },
      },
      {
        title: { en: 'Hardening and testing', id: 'Penguatan dan pengujian' },
        body: {
          en: [
            'Phase 8 measured instead of claiming (ADR-016): a p95 under 500 ms on 100,000 output rows, WCAG A and AA checked by axe on the critical screens with no violation, Lighthouse of 100 for performance and accessibility on the login page and the dashboard, and 94.5% line coverage of Domain and Application.',
            'Every endpoint has integration tests for success, validation failure, 401 and a forbidden role, run on a real PostgreSQL started by Testcontainers, with an in-process stand-in for Keycloak. Playwright runs the real app, API and Keycloak end to end.',
          ],
          id: [
            'Fase 8 mengukur, bukan mengklaim (ADR-016): p95 di bawah 500 ms pada 100.000 baris output, WCAG A dan AA diperiksa axe pada layar kritis tanpa pelanggaran, Lighthouse 100 untuk performa dan aksesibilitas pada halaman login dan dashboard, dan cakupan baris 94,5% untuk Domain dan Application.',
            'Setiap endpoint punya tes integrasi untuk sukses, kegagalan validasi, 401, dan peran terlarang, dijalankan di PostgreSQL asli yang dinyalakan Testcontainers, dengan pengganti Keycloak di dalam proses. Playwright menjalankan aplikasi, API, dan Keycloak yang asli dari ujung ke ujung.',
          ],
        },
      },
      {
        title: { en: 'Deployment', id: 'Deployment' },
        body: {
          en: [
            'The production package is a Docker Compose stack (ADR-017): Caddy for HTTPS and the app, the API as an unprivileged user, Keycloak in production mode and PostgreSQL. It passes a 20-check smoke test from empty volumes, backup and restore scripts are proven with identical row counts, and the CI builds, scans and publishes the images to the GitHub Container Registry.',
          ],
          id: [
            'Paket produksi adalah stack Docker Compose (ADR-017): Caddy untuk HTTPS dan aplikasi, API sebagai pengguna tanpa hak istimewa, Keycloak dalam mode produksi, dan PostgreSQL. Paket ini lolos smoke test 20 pemeriksaan dari volume kosong, skrip backup dan restore terbukti dengan jumlah baris identik, dan CI membangun, memindai, dan mempublikasikan image ke GitHub Container Registry.',
          ],
        },
      },
      {
        title: { en: 'Known limitations', id: 'Keterbatasan yang diketahui' },
        body: {
          en: [
            'The project lists what it does not do, so nobody finds out by accident: one plant only, a fixed two-step approval, no machine or ERP integration, in-app notifications only, no hosted demo, manual backups, and a shell that does not support a phone width. Each item names the decision or measurement behind it, and a roadmap follows.',
          ],
          id: [
            'Proyek mencantumkan yang tidak dikerjakannya, agar tidak ada yang menemukannya secara tidak sengaja: hanya satu pabrik, persetujuan dua langkah yang tetap, tanpa integrasi mesin atau ERP, hanya notifikasi dalam aplikasi, belum ada demo yang di-host, backup manual, dan shell yang belum mendukung lebar layar ponsel. Setiap butir menyebut keputusan atau pengukuran di baliknya, dan peta jalan menyusul.',
          ],
        },
      },
    ],
    dataModules: [],
    decisions: [
      { id: 'ADR-001', title: { en: 'Signals + RxJS for front-end state', id: 'Signals + RxJS untuk state front end' }, summary: { en: 'Signals for state that templates read, RxJS for asynchronous streams, one service per feature. NgRx only if a real need appears.', id: 'Signals untuk state yang dibaca template, RxJS untuk aliran asinkron, satu service per fitur. NgRx hanya jika kebutuhan nyata muncul.' } },
      { id: 'ADR-002', title: { en: 'Modular monolith with Clean Architecture', id: 'Modular monolith dengan Clean Architecture' }, summary: { en: 'One deployable, four layers, no generic repository, and PostgreSQL-specific code kept in Infrastructure so a move to SQL Server stays easy.', id: 'Satu unit deploy, empat lapisan, tanpa generic repository, dan kode khusus PostgreSQL tetap di Infrastructure agar pindah ke SQL Server tetap mudah.' } },
      { id: 'ADR-005', title: { en: 'MVP scope and data decisions', id: 'Cakupan MVP dan keputusan data' }, summary: { en: 'A single plant with a nullable plant_id kept for later, a fixed two-step approval on a generic table, and segregation of duties.', id: 'Satu pabrik dengan plant_id nullable untuk nanti, persetujuan dua langkah tetap pada tabel generik, dan pemisahan tugas.' } },
      { id: 'ADR-010', title: { en: 'Keycloak as the identity provider', id: 'Keycloak sebagai penyedia identitas' }, summary: { en: 'The API is a backend-for-frontend, so tokens stay on the server. Keycloak owns accounts and roles; the application owns the permission matrix.', id: 'API adalah backend-for-frontend, sehingga token tetap di server. Keycloak memegang akun dan peran; aplikasi memegang matriks izin.' } },
      { id: 'ADR-012', title: { en: 'Production orders, work orders and output tracking', id: 'Order produksi, work order, dan pelacakan output' }, summary: { en: 'A configurable output limit of the plan plus 10 percent, passing it is a 422, and output records are append-only.', id: 'Batas output yang dapat diatur sebesar rencana ditambah 10 persen, melewatinya menghasilkan 422, dan rekaman output append-only.' } },
      { id: 'ADR-013', title: { en: 'Inspection templates, inspections and defects', id: 'Template inspeksi, inspeksi, dan cacat' }, summary: { en: 'The template rule decides the result, and a failed inspection raises its defect in one transaction.', id: 'Aturan template menentukan hasil, dan inspeksi yang gagal memunculkan cacatnya dalam satu transaksi.' } },
      { id: 'ADR-014', title: { en: 'Approval workflow and audit trail', id: 'Alur persetujuan dan jejak audit' }, summary: { en: 'Two actions need two approvals, and the system carries the action out in the same transaction as the last decision.', id: 'Dua aksi membutuhkan dua persetujuan, dan sistem menjalankan aksinya dalam transaksi yang sama dengan keputusan terakhir.' } },
      { id: 'ADR-015', title: { en: 'Dashboard, reports and notifications', id: 'Dashboard, laporan, dan notifikasi' }, summary: { en: 'ECharts through ngx-echarts in a lazy chunk, KPIs from aggregation queries, and notifications written with the event.', id: 'ECharts lewat ngx-echarts dalam chunk malas, KPI dari query agregasi, dan notifikasi ditulis bersama kejadiannya.' } },
      { id: 'ADR-016', title: { en: 'Hardening: security, performance, accessibility', id: 'Penguatan: keamanan, performa, aksesibilitas' }, summary: { en: 'axe in the end-to-end suite; Lighthouse and coverage are measured and recorded, not CI gates.', id: 'axe di suite end-to-end; Lighthouse dan cakupan diukur dan dicatat, bukan gerbang CI.' } },
      { id: 'ADR-017', title: { en: 'Deployment package and documentation', id: 'Paket deployment dan dokumentasi' }, summary: { en: 'A production Docker Compose package tested from a clean state; no hosted deployment, recorded as a limitation.', id: 'Paket produksi Docker Compose yang diuji dari keadaan bersih; tanpa deployment ter-host, dicatat sebagai keterbatasan.' } },
    ],
    stackGroups: [
      { group: { en: 'Frontend', id: 'Frontend' }, items: ['Angular 22', 'TypeScript', 'Angular Material', 'Angular Signals', 'RxJS', 'Angular Router', 'Angular Reactive Forms', 'Angular HttpClient', 'ngx-echarts (ECharts 6)'] },
      { group: { en: 'Backend', id: 'Backend' }, items: ['C#', '.NET 10', 'ASP.NET Core Minimal API', 'Clean Architecture', 'FluentValidation', 'Serilog', 'OpenAPI', 'Scalar'] },
      { group: { en: 'Data', id: 'Data' }, items: ['PostgreSQL', 'Entity Framework Core 10', 'Npgsql'] },
      { group: { en: 'Identity', id: 'Identitas' }, items: ['Keycloak', 'OpenID Connect', 'HttpOnly session cookie (backend-for-frontend)'] },
      { group: { en: 'Testing', id: 'Pengujian' }, items: ['xUnit', 'Testcontainers', 'Angular test runner (Vitest)', 'Playwright', 'axe-core', 'Lighthouse'] },
      { group: { en: 'Delivery', id: 'Pengiriman' }, items: ['Docker', 'Docker Compose', 'Caddy', 'GitHub Actions', 'GitHub Container Registry'] },
    ],
    highlights: {
      en: [
        'A full operations-and-quality chain in one system: orders, work orders, output, inspections, defects, approvals, KPIs and an audit trail, for seven roles.',
        'Security by design: Keycloak with the API as backend-for-frontend, 35 permissions enforced in the backend, and 401 and 403 tests for every endpoint.',
        'Append-only records with corrections through audited revision, void or adjustment, and an audit log that never stores a secret.',
        'Measured, not claimed: a p95 under 500 ms on 100,000 output rows, axe with no violation, Lighthouse 100 for performance and accessibility, and 94.5% line coverage of Domain and Application.',
        'A production Docker Compose package that passes a 20-check smoke test from empty volumes, with proven backup and restore, and images published by the CI.',
        'Documentation in English and Indonesian: a PRD, system design with diagrams, 17 decision records, wireframes, a technical Q&A, a deployment guide and an honest list of known limitations.',
      ],
      id: [
        'Rantai operasi dan kualitas lengkap dalam satu sistem: order, work order, output, inspeksi, cacat, persetujuan, KPI, dan jejak audit, untuk tujuh peran.',
        'Keamanan sejak desain: Keycloak dengan API sebagai backend-for-frontend, 35 izin yang diberlakukan di backend, dan tes 401 dan 403 untuk setiap endpoint.',
        'Rekaman append-only dengan koreksi lewat revisi, pembatalan, atau penyesuaian yang diaudit, dan audit log yang tidak pernah menyimpan rahasia.',
        'Diukur, bukan diklaim: p95 di bawah 500 ms pada 100.000 baris output, axe tanpa pelanggaran, Lighthouse 100 untuk performa dan aksesibilitas, dan cakupan baris 94,5% untuk Domain dan Application.',
        'Paket produksi Docker Compose yang lolos smoke test 20 pemeriksaan dari volume kosong, dengan backup dan restore yang terbukti, dan image yang dipublikasikan oleh CI.',
        'Dokumentasi dalam bahasa Inggris dan Indonesia: PRD, desain sistem dengan diagram, 17 catatan keputusan, wireframe, tanya jawab teknis, panduan deployment, dan daftar keterbatasan yang jujur.',
      ],
    },
    docs: [],
    phases: [
      { n: 1, scope: { en: 'Foundation: Angular shell, ASP.NET Core API, PostgreSQL, EF Core migration, first vertical slice', id: 'Fondasi: shell Angular, API ASP.NET Core, PostgreSQL, migrasi EF Core, irisan vertikal pertama' }, done: true },
      { n: 2, scope: { en: 'Authentication and access: Keycloak sign-in, roles, permission matrix, Administration screens', id: 'Autentikasi dan akses: masuk dengan Keycloak, peran, matriks izin, layar Administrasi' }, done: true },
      { n: 3, scope: { en: 'Master data: products, lines, workstations, defect categories', id: 'Data master: produk, lini, workstation, kategori cacat' }, done: true },
      { n: 4, scope: { en: 'Production: order lifecycle, work orders, append-only output tracking', id: 'Produksi: siklus order, work order, pelacakan output append-only' }, done: true },
      { n: 5, scope: { en: 'Quality: inspection templates, inspections, defects and corrective actions', id: 'Kualitas: template inspeksi, inspeksi, cacat, dan tindakan korektif' }, done: true },
      { n: 6, scope: { en: 'Workflow: two-step approval and the audit trail', id: 'Alur kerja: persetujuan dua langkah dan jejak audit' }, done: true },
      { n: 7, scope: { en: 'Dashboard, reports and notifications: KPIs, charts, CSV export, bell', id: 'Dashboard, laporan, dan notifikasi: KPI, grafik, ekspor CSV, lonceng' }, done: true },
      { n: 8, scope: { en: 'Hardening: security, performance, accessibility, coverage', id: 'Penguatan: keamanan, performa, aksesibilitas, cakupan' }, done: true },
      { n: 9, scope: { en: 'Deployment: production Docker Compose package, CI images, backup and restore, documentation', id: 'Deployment: paket produksi Docker Compose, image CI, backup dan restore, dokumentasi' }, done: true },
    ],
    gallery: [
      { kind: 'flow', file: 'flows/demo-tour.gif', width: 1000, height: 604, caption: { en: `A 12-step tour recorded from the real app on the demo dataset: sign-in, dashboard, a failed inspection raising its defect, the approval inbox and the audit log. Demo by ${DEMO_BY}`, id: `Tur 12 langkah yang direkam dari aplikasi asli pada dataset demo: masuk, dashboard, inspeksi gagal yang memunculkan cacatnya, kotak masuk persetujuan, dan audit log. Demo oleh ${DEMO_BY}` } },
      { kind: 'shot', file: 'screenshots/dashboard.png', width: 1280, height: 2355, caption: { en: `Dashboard: KPIs with their formulas, trends and the defect breakdown. Demo by ${DEMO_BY}`, id: `Dashboard: KPI beserta rumusnya, tren, dan rincian cacat. Demo oleh ${DEMO_BY}` } },
      { kind: 'shot', file: 'screenshots/production-orders.png', width: 1280, height: 800, caption: { en: `Production orders: server-side filters, progress and CSV export. Demo by ${DEMO_BY}`, id: `Order produksi: filter di sisi server, progres, dan ekspor CSV. Demo oleh ${DEMO_BY}` } },
      { kind: 'shot', file: 'screenshots/inspection.png', width: 1280, height: 951, caption: { en: `Inspection: a failed check raises its defect in one step. Demo by ${DEMO_BY}`, id: `Inspeksi: pemeriksaan yang gagal memunculkan cacatnya dalam satu langkah. Demo oleh ${DEMO_BY}` } },
      { kind: 'shot', file: 'screenshots/defect.png', width: 1280, height: 1187, caption: { en: `Defect: workflow, corrective actions and activity. Demo by ${DEMO_BY}`, id: `Cacat: alur kerja, tindakan korektif, dan aktivitas. Demo oleh ${DEMO_BY}` } },
      { kind: 'shot', file: 'screenshots/approvals.png', width: 1280, height: 800, caption: { en: `Approval inbox: two-step approval with segregation of duties. Demo by ${DEMO_BY}`, id: `Kotak masuk persetujuan: persetujuan dua langkah dengan pemisahan tugas. Demo oleh ${DEMO_BY}` } },
    ],
    links: [],
  },
];

export const getPersonalProject = (slug: string) => personalProjects.find((p) => p.slug === slug);
