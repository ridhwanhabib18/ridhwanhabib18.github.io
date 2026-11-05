// Indonesian translations of the text that comes from the Typst resume source.
// Keyed by the exact English source string. When the Typst text changes, the old key no longer matches
// and a test fails until the translation is updated here. Do not translate technology names.
export const idTranslations: Record<string, string> = {
  "Full Stack .NET Engineer with 4+ years at a global manufacturer, building internal systems with ASP.NET Core, React/TypeScript and SQL Server. Delivered 5 production systems end to end. Cut part review preparation by about 86% and production-line recovery time after program changes by about 90%. Strong in CI/CD, integration testing and system design.":
    "Full Stack .NET Engineer dengan pengalaman 4+ tahun di perusahaan manufaktur global, membangun sistem internal dengan ASP.NET Core, React/TypeScript, dan SQL Server. Menyelesaikan 5 sistem produksi secara end to end. Memangkas persiapan part review sekitar 86% dan waktu pemulihan lini produksi setelah perubahan program sekitar 90%. Kuat di CI/CD, integration testing, dan desain sistem.",
  "Full Stack .NET Engineer and technical lead of a 2-person team at a global manufacturer. Delivered 5 production systems end to end with ASP.NET Core, React/TypeScript and SQL Server. Set coding standards, run code reviews and mentor a junior developer. Cut part review preparation by about 86% and line recovery time by about 90%.":
    "Full Stack .NET Engineer sekaligus technical lead tim beranggotakan 2 orang di perusahaan manufaktur global. Menyelesaikan 5 sistem produksi secara end to end dengan ASP.NET Core, React/TypeScript, dan SQL Server. Menetapkan standar coding, memimpin code review, dan membimbing seorang junior developer. Memangkas persiapan part review sekitar 86% dan waktu pemulihan lini sekitar 90%.",
  "Full Stack .NET Engineer with 4+ years at a global manufacturer who turns requirements from production, engineering, purchasing and management into business cases, PRDs and system designs, then delivers them. Delivered 5 production systems end to end. Cut part review preparation by about 86%.":
    "Full Stack .NET Engineer dengan pengalaman 4+ tahun di perusahaan manufaktur global yang mengubah kebutuhan dari produksi, engineering, purchasing, dan manajemen menjadi business case, PRD, dan desain sistem, lalu mengimplementasikannya. Menyelesaikan 5 sistem produksi secara end to end. Memangkas persiapan part review sekitar 86%.",
  "Leadership":
    "Kepemimpinan",
  "lead code reviews, mentor a junior developer and set coding standards for a 2-person team; present proposals to production, engineering, purchasing and management at stage-gate design reviews":
    "memimpin code review, membimbing seorang junior developer, dan menetapkan standar coding untuk tim 2 orang; mempresentasikan proposal kepada produksi, engineering, purchasing, dan manajemen pada stage-gate design review",
  "Parts Engineering Management System":
    "Sistem Manajemen Parts Engineering",
  "replaced the paper part review inspection sheet with an online approval workflow (ASP.NET MVC 5, Dapper, 200+ SQL Server stored procedures, Hangfire, Telerik). Cut part review preparation by about 86%, removed manual part master and index creation, eliminated paper and ink, and delivered measured annual cost savings":
    "mengganti lembar inspeksi part review berbasis kertas dengan alur persetujuan online (ASP.NET MVC 5, Dapper, 200+ stored procedure SQL Server, Hangfire, Telerik). Memangkas persiapan part review sekitar 86%, menghilangkan pembuatan manual part master dan index, menghilangkan kertas dan tinta, serta menghasilkan penghematan biaya tahunan yang terukur",
  "Production File Distribution & Monitoring System":
    "Sistem Distribusi & Monitoring File Produksi",
  "replaced flash-disk distribution of line program files with central management, automatic install and real-time file-match monitoring (ASP.NET Core, React, SignalR, WinForms client), rolled out to multiple factories. Cut line recovery after a program change by about 90% (hours to minutes) and removed manual installs by 2 people":
    "mengganti distribusi file program lini lewat flash disk dengan manajemen terpusat, instalasi otomatis, dan monitoring kecocokan file secara real-time (ASP.NET Core, React, SignalR, klien WinForms), diluncurkan ke beberapa pabrik. Memangkas pemulihan lini setelah perubahan program sekitar 90% (jam menjadi menit) dan menghilangkan instalasi manual oleh 2 orang",
  "Process Inspection Data System":
    "Sistem Data Inspeksi Proses",
  "automated inspection data collection from line PCs (WinForms/ClickOnce) with live production progress dashboards (SignalR, Quartz.NET)":
    "mengotomatiskan pengumpulan data inspeksi dari PC lini (WinForms/ClickOnce) dengan dashboard progres produksi secara langsung (SignalR, Quartz.NET)",
  "Production Planning & Scheduling System":
    "Sistem Perencanaan & Penjadwalan Produksi",
  "replaced manual Excel planning with automated hourly planning, simulation and approval workflow on .NET 10, EF Core, React and a clustered Quartz.NET service. Target: about 48% less planner workload":
    "mengganti perencanaan manual di Excel dengan perencanaan per jam otomatis, simulasi, dan alur persetujuan di .NET 10, EF Core, React, dan layanan Quartz.NET ter-cluster. Target: beban kerja planner sekitar 48% lebih sedikit",
  "Paperless Invoice Approval System":
    "Sistem Persetujuan Invoice Paperless",
  "digitized supplier invoice handling with AWS S3 and Textract OCR and Keycloak SSO (ASP.NET Core 8, React/TypeScript). Target: large reduction in manual invoice handling effort":
    "mendigitalkan penanganan invoice supplier dengan AWS S3, OCR Textract, dan Keycloak SSO (ASP.NET Core 8, React/TypeScript). Target: pengurangan besar upaya penanganan invoice manual",
  "Supporting contributions (3 further projects)":
    "Kontribusi pendukung (3 proyek lain)",
  "developed SQL Server stored procedures for the part approval certification workflow (certification preparation about 96% faster); implemented real-time WebSocket communication with SignalR for operator work-cycle time monitoring; and reviewed code for a printer function-test data summary system on the production line":
    "mengembangkan stored procedure SQL Server untuk alur sertifikasi persetujuan part (persiapan sertifikasi sekitar 96% lebih cepat); mengimplementasikan komunikasi WebSocket real-time dengan SignalR untuk monitoring waktu siklus kerja operator; dan melakukan code review untuk sistem ringkasan data function test printer di lini produksi",
  "Engineering practice":
    "Praktik engineering",
  "built GitHub Actions CI/CD (PR tests, GitVersion, IIS deploy with backup and EF migration), API and database integration tests, and reverse-engineered PRDs, ERDs and ADRs for existing systems":
    "membangun CI/CD GitHub Actions (tes PR, GitVersion, deploy IIS dengan backup dan migrasi EF), tes integrasi API dan database, serta melakukan reverse-engineering PRD, ERD, dan ADR untuk sistem yang sudah ada",
  "Implemented and tested RS-232 and RS-485 communication modules on embedded boards using Arduino, C and C++":
    "Mengimplementasikan dan menguji modul komunikasi RS-232 dan RS-485 pada board embedded dengan Arduino, C, dan C++",
  "Programming & Backend":
    "Pemrograman & Backend",
  "Frontend":
    "Frontend",
  "Cloud & Integration":
    "Cloud & Integrasi",
  "Architecture & Delivery":
    "Arsitektur & Delivery",
  "DevOps & Quality":
    "DevOps & Kualitas",
  "Desktop, Reporting & Automation":
    "Desktop, Pelaporan & Otomasi",
  "Additional Technologies":
    "Teknologi Tambahan",
  "Bachelor of Engineering in Electrical Engineering":
    "Sarjana Teknik (S.T.) Teknik Elektro",
  "Bekasi Regency, West Java, Indonesia":
    "Kabupaten Bekasi, Jawa Barat, Indonesia",
};
