import type { Project } from './types';

/**
 * Case studies use descriptive system names only. No internal code names, no currency,
 * no absolute hour counts. Every metric is labelled actual or target.
 * Statements below are limited to facts already used on the resume.
 */
export const projects: Project[] = [
  {
    slug: 'parts-engineering-management',
    resumeBullet: 'Parts Engineering Management System',
    beyondResume: ['inspection platform'],
    kind: 'delivered',
    title: { en: 'Parts Engineering Management System', id: 'Sistem Manajemen Parts Engineering' },
    summary: {
      en: 'Replaced the paper part review inspection sheet with an online approval workflow.',
      id: 'Mengganti lembar inspeksi part review berbasis kertas dengan alur persetujuan online.',
    },
    role: { en: 'End-to-end owner: analysis, design, development, deployment, support', id: 'Pemilik end to end: analisis, desain, pengembangan, deployment, dukungan' },
    tags: ['aspnet', 'data', 'integration'],
    stack: ['ASP.NET MVC 5', 'Dapper', 'SQL Server', 'Hangfire', 'Telerik Reporting'],
    metrics: [
      { label: { en: 'Part review preparation', id: 'Persiapan part review' }, value: { en: 'about 86% faster', id: 'sekitar 86% lebih cepat' }, type: 'actual' },
      { label: { en: 'Manual part master and index creation', id: 'Pembuatan manual part master dan index' }, value: { en: 'removed', id: 'dihilangkan' }, type: 'actual' },
      { label: { en: 'Paper and ink', id: 'Kertas dan tinta' }, value: { en: 'eliminated', id: 'dihilangkan' }, type: 'actual' },
    ],
    sections: {
      context: {
        en: 'Engineering reviewed every new part on a paper inspection sheet before it moved to the next stage. The sheet was filled in, routed and archived by hand.',
        id: 'Engineering meninjau setiap part baru menggunakan lembar inspeksi kertas sebelum lanjut ke tahap berikutnya. Lembar itu diisi, diedarkan, dan diarsipkan secara manual.',
      },
      problem: {
        en: 'Preparing and routing the sheets consumed review time, made status hard to see, and used large volumes of paper and ink.',
        id: 'Menyiapkan dan mengedarkan lembar tersebut memakan waktu review, membuat status sulit dilihat, dan menghabiskan banyak kertas dan tinta.',
      },
      approach: {
        en: [
          'Online part review and approval workflow replacing the paper sheet.',
          'Integration with the inspection platform so inspection data is picked up instead of retyped.',
          'Background jobs with Hangfire and printable output with Telerik Reporting.',
          'ASP.NET MVC 5 with Dapper over more than 200 SQL Server stored procedures.',
        ],
        id: [
          'Alur part review dan persetujuan online sebagai pengganti lembar kertas.',
          'Integrasi dengan platform inspeksi sehingga data inspeksi diambil otomatis, bukan diketik ulang.',
          'Background job dengan Hangfire dan keluaran cetak dengan Telerik Reporting.',
          'ASP.NET MVC 5 dengan Dapper di atas lebih dari 200 stored procedure SQL Server.',
        ],
      },
      result: {
        en: [
          'Part review preparation about 86% faster, measured after go-live.',
          'Manual part master and part index creation removed.',
          'Paper and ink for part review eliminated, with measured annual cost savings.',
        ],
        id: [
          'Persiapan part review sekitar 86% lebih cepat, diukur setelah go-live.',
          'Pembuatan manual part master dan part index dihilangkan.',
          'Kertas dan tinta untuk part review dihilangkan, dengan penghematan biaya tahunan yang terukur.',
        ],
      },
    },
    diagram: {
      nodes: [
        { id: 'user', label: 'Engineers', col: 0, row: 1, kind: 'client' },
        { id: 'web', label: 'ASP.NET MVC 5', col: 1, row: 1, kind: 'service' },
        { id: 'jobs', label: 'Hangfire jobs', col: 2, row: 0, kind: 'service' },
        { id: 'db', label: 'SQL Server', col: 2, row: 1, kind: 'data' },
        { id: 'insp', label: 'Inspection platform', col: 2, row: 2, kind: 'external' },
        { id: 'rep', label: 'Telerik reports', col: 1, row: 2, kind: 'service' },
      ],
      edges: [
        { from: 'user', to: 'web' },
        { from: 'web', to: 'db', label: 'Dapper' },
        { from: 'jobs', to: 'db' },
        { from: 'insp', to: 'db' },
        { from: 'web', to: 'rep' },
      ],
    },
  },
  {
    slug: 'production-file-distribution',
    resumeBullet: 'Production File Distribution & Monitoring System',
    beyondResume: ['background download', 'scheduled version changes', 'column filtering', 'audit trail', 'Remote update', 'Trialled on lines'],
    kind: 'delivered',
    title: { en: 'Production File Distribution & Monitoring System', id: 'Sistem Distribusi & Monitoring File Produksi' },
    summary: {
      en: 'Central, automatic and monitored program updates for production line PCs, replacing flash disks.',
      id: 'Pembaruan program yang terpusat, otomatis, dan terpantau untuk PC lini produksi, menggantikan flash disk.',
    },
    role: { en: 'End-to-end owner (v1 and v2 upgrade)', id: 'Pemilik end to end (v1 dan upgrade v2)' },
    tags: ['aspnet', 'react', 'realtime', 'integration'],
    stack: ['ASP.NET Core', 'React', 'SignalR', 'WinForms client'],
    metrics: [
      { label: { en: 'Line recovery after a program change', id: 'Pemulihan lini setelah perubahan program' }, value: { en: 'about 90% faster (hours to minutes)', id: 'sekitar 90% lebih cepat (jam menjadi menit)' }, type: 'actual' },
      { label: { en: 'Manual installation by 2 people', id: 'Instalasi manual oleh 2 orang' }, value: { en: 'removed', id: 'dihilangkan' }, type: 'actual' },
      { label: { en: 'Wrong-version installs and flash-disk virus risk', id: 'Salah versi dan risiko virus flash disk' }, value: { en: 'eliminated', id: 'dihilangkan' }, type: 'actual' },
    ],
    sections: {
      context: {
        en: 'Production programs for line equipment were copied to flash disks and installed by hand on each line PC after every program change.',
        id: 'Program produksi untuk peralatan lini disalin ke flash disk dan dipasang manual di setiap PC lini setiap kali program berubah.',
      },
      problem: {
        en: 'Recovery after a change took hours and needed 2 people. Wrong versions could be installed, and flash disks carried a virus risk.',
        id: 'Pemulihan setelah perubahan memakan waktu berjam-jam dan membutuhkan 2 orang. Versi yang salah bisa terpasang, dan flash disk membawa risiko virus.',
      },
      approach: {
        en: [
          'Central management of program files with automatic installation on line PCs.',
          'Real-time file-match monitoring, so a line PC that differs from the approved version is visible immediately.',
          'Remote update and a change audit trail.',
          'v2 added background download, scheduled version changes and column filtering.',
          'Trialled on lines first, then rolled out to multiple factories.',
        ],
        id: [
          'Manajemen file program secara terpusat dengan instalasi otomatis di PC lini.',
          'Monitoring kecocokan file secara real-time, sehingga PC lini yang berbeda dari versi yang disetujui langsung terlihat.',
          'Update jarak jauh dan audit trail perubahan.',
          'v2 menambahkan unduhan di latar belakang, jadwal pergantian versi, dan filter kolom.',
          'Diuji di lini terlebih dahulu, lalu diluncurkan ke beberapa pabrik.',
        ],
      },
      decisions: {
        en: [
          'A WinForms client on each line PC, because the equipment software runs on Windows desktops.',
          'SignalR for live status, so operators and engineers see matches and mismatches without refreshing.',
        ],
        id: [
          'Klien WinForms di setiap PC lini, karena perangkat lunak peralatan berjalan di desktop Windows.',
          'SignalR untuk status langsung, sehingga operator dan engineer melihat kecocokan dan ketidakcocokan tanpa refresh.',
        ],
      },
      result: {
        en: [
          'Line recovery after a program change about 90% faster, from hours to minutes.',
          'The need for 2 people to install manually removed.',
          'Wrong-version installs and flash-disk virus risk eliminated.',
        ],
        id: [
          'Pemulihan lini setelah perubahan program sekitar 90% lebih cepat, dari jam menjadi menit.',
          'Kebutuhan 2 orang untuk instalasi manual dihilangkan.',
          'Salah versi dan risiko virus flash disk dihilangkan.',
        ],
      },
    },
    diagram: {
      nodes: [
        { id: 'admin', label: 'Admin web (React)', col: 0, row: 0, kind: 'client' },
        { id: 'api', label: 'ASP.NET Core API', col: 1, row: 1, kind: 'service' },
        { id: 'hub', label: 'SignalR hub', col: 2, row: 0, kind: 'service' },
        { id: 'db', label: 'Database', col: 1, row: 2, kind: 'data' },
        { id: 'pc', label: 'Line PC (client)', col: 3, row: 1, kind: 'external' },
      ],
      edges: [
        { from: 'admin', to: 'api' },
        { from: 'api', to: 'hub' },
        { from: 'api', to: 'db' },
        { from: 'hub', to: 'pc', label: 'live status' },
        { from: 'pc', to: 'api', label: 'file match' },
      ],
    },
  },
  {
    slug: 'production-planning-scheduling',
    resumeBullet: 'Production Planning & Scheduling System',
    beyondResume: ['capacity control', 'WIP stock system', '45+ migrations', 'minimal API', 'Windows Service', 'payback within the first year'],
    kind: 'delivered',
    title: { en: 'Production Planning & Scheduling System', id: 'Sistem Perencanaan & Penjadwalan Produksi' },
    summary: {
      en: 'Automated hourly planning cycle replacing manual Excel planning.',
      id: 'Siklus perencanaan otomatis per jam yang menggantikan perencanaan manual di Excel.',
    },
    role: { en: 'End-to-end owner and architect', id: 'Pemilik end to end dan arsitek' },
    tags: ['aspnet', 'react', 'integration', 'data'],
    stack: ['.NET 10', 'EF Core', 'React', 'Quartz.NET'],
    metrics: [
      { label: { en: 'Planner workload', id: 'Beban kerja planner' }, value: { en: 'about 48% less', id: 'sekitar 48% lebih sedikit' }, type: 'target' },
      { label: { en: 'Payback', id: 'Pengembalian investasi' }, value: { en: 'within the first year', id: 'dalam tahun pertama' }, type: 'target' },
    ],
    sections: {
      context: {
        en: 'Production planning was done in Excel by planners, who rebuilt the plan manually whenever inputs changed.',
        id: 'Perencanaan produksi dilakukan di Excel oleh planner, yang menyusun ulang rencana secara manual setiap kali input berubah.',
      },
      problem: {
        en: 'Manual replanning was slow and error-prone, and capacity limits and approvals were hard to track.',
        id: 'Perencanaan ulang manual lambat dan rawan kesalahan, serta batas kapasitas dan persetujuan sulit dilacak.',
      },
      approach: {
        en: [
          'Automated hourly planning cycle with capacity control and simulation.',
          'Approval workflow for plan changes.',
          'Integration with the WIP stock system.',
          '.NET 10 minimal API with EF Core (45+ migrations), a React single-page app, and a clustered Quartz.NET Windows Service.',
        ],
        id: [
          'Siklus perencanaan otomatis per jam dengan kontrol kapasitas dan simulasi.',
          'Alur persetujuan untuk perubahan rencana.',
          'Integrasi dengan sistem stok WIP.',
          'Minimal API .NET 10 dengan EF Core (45+ migrasi), single-page app React, dan Windows Service Quartz.NET ter-cluster.',
        ],
      },
      decisions: {
        en: ['A clustered Quartz.NET service so the hourly planning job does not depend on a single process.'],
        id: ['Layanan Quartz.NET ter-cluster agar job perencanaan per jam tidak bergantung pada satu proses.'],
      },
      result: {
        en: [
          'Target from the approved proposal: about 48% less planner workload.',
          'Target: payback within the first year.',
          'Presented as a target because the proposal figures are not yet measured results.',
        ],
        id: [
          'Target dari proposal yang disetujui: beban kerja planner sekitar 48% lebih sedikit.',
          'Target: pengembalian investasi dalam tahun pertama.',
          'Disajikan sebagai target karena angka proposal belum merupakan hasil terukur.',
        ],
      },
    },
    diagram: {
      nodes: [
        { id: 'spa', label: 'React SPA', col: 0, row: 1, kind: 'client' },
        { id: 'api', label: '.NET 10 minimal API', col: 1, row: 1, kind: 'service' },
        { id: 'db', label: 'Database (EF Core)', col: 2, row: 1, kind: 'data' },
        { id: 'quartz', label: 'Quartz.NET service (clustered)', col: 1, row: 0, kind: 'service' },
        { id: 'wip', label: 'WIP stock system', col: 2, row: 0, kind: 'external' },
      ],
      edges: [
        { from: 'spa', to: 'api' },
        { from: 'api', to: 'db' },
        { from: 'quartz', to: 'db', label: 'hourly plan' },
        { from: 'wip', to: 'quartz' },
      ],
    },
  },
  {
    slug: 'paperless-invoice-approval',
    resumeBullet: 'Paperless Invoice Approval System',
    beyondResume: ['Vendor-specific extraction rules'],
    kind: 'delivered',
    title: { en: 'Paperless Invoice Approval System', id: 'Sistem Persetujuan Invoice Paperless' },
    summary: {
      en: 'OCR-assisted handling of supplier invoices and debit/credit notes with an approval workflow.',
      id: 'Penanganan invoice supplier dan debit/credit note berbantuan OCR dengan alur persetujuan.',
    },
    role: { en: 'End-to-end owner', id: 'Pemilik end to end' },
    tags: ['aspnet', 'react', 'integration'],
    stack: ['ASP.NET Core 8', 'React', 'TypeScript', 'AWS S3', 'AWS Textract', 'Keycloak SSO'],
    metrics: [
      { label: { en: 'Manual invoice handling effort', id: 'Upaya penanganan invoice manual' }, value: { en: 'large reduction (see approved proposal)', id: 'pengurangan besar (lihat proposal yang disetujui)' }, type: 'target' },
    ],
    sections: {
      context: {
        en: 'Supplier invoices and DN/CN documents arrived on paper or as files and were keyed in and approved manually.',
        id: 'Invoice supplier dan dokumen DN/CN datang dalam bentuk kertas atau file dan dimasukkan serta disetujui secara manual.',
      },
      problem: {
        en: 'Manual keying and routing took large amounts of effort and made status hard to follow.',
        id: 'Pengetikan dan pengedaran manual memakan banyak upaya dan membuat status sulit diikuti.',
      },
      approach: {
        en: [
          'Documents stored in AWS S3 and read with AWS Textract OCR.',
          'Vendor-specific extraction rules to handle different invoice layouts.',
          'Approval workflow with Keycloak single sign-on.',
          'ASP.NET Core 8 back end with a React and TypeScript front end.',
        ],
        id: [
          'Dokumen disimpan di AWS S3 dan dibaca dengan OCR AWS Textract.',
          'Aturan ekstraksi khusus per vendor untuk menangani tata letak invoice yang berbeda.',
          'Alur persetujuan dengan single sign-on Keycloak.',
          'Back end ASP.NET Core 8 dengan front end React dan TypeScript.',
        ],
      },
      result: {
        en: [
          'Target from the approved proposal: a large reduction in manual invoice handling effort per month.',
          'Presented as a target; the proposal figures are not published here.',
        ],
        id: [
          'Target dari proposal yang disetujui: pengurangan besar upaya penanganan invoice manual per bulan.',
          'Disajikan sebagai target; angka proposal tidak dipublikasikan di sini.',
        ],
      },
    },
    diagram: {
      nodes: [
        { id: 'user', label: 'Users (SSO)', col: 0, row: 1, kind: 'client' },
        { id: 'kc', label: 'Keycloak', col: 1, row: 0, kind: 'external' },
        { id: 'api', label: 'ASP.NET Core 8 API', col: 1, row: 1, kind: 'service' },
        { id: 's3', label: 'AWS S3', col: 2, row: 0, kind: 'external' },
        { id: 'tx', label: 'AWS Textract', col: 2, row: 1, kind: 'external' },
        { id: 'db', label: 'Database', col: 2, row: 2, kind: 'data' },
      ],
      edges: [
        { from: 'user', to: 'kc' },
        { from: 'user', to: 'api' },
        { from: 'api', to: 's3' },
        { from: 'api', to: 'tx', label: 'OCR' },
        { from: 'api', to: 'db' },
      ],
    },
  },
  {
    slug: 'process-inspection-data',
    resumeBullet: 'Process Inspection Data System',
    beyondResume: ['adjustment-rate'],
    kind: 'delivered',
    title: { en: 'Process Inspection Data System', id: 'Sistem Data Inspeksi Proses' },
    summary: {
      en: 'Automatic collection of inspection data from line PCs with live production dashboards.',
      id: 'Pengumpulan otomatis data inspeksi dari PC lini dengan dashboard produksi langsung.',
    },
    role: { en: 'End-to-end owner', id: 'Pemilik end to end' },
    tags: ['realtime', 'data', 'integration'],
    stack: ['WinForms', 'ClickOnce', 'SignalR', 'Quartz.NET'],
    metrics: [
      { label: { en: 'Engineering time on manual data handling', id: 'Waktu engineering untuk penanganan data manual' }, value: { en: 'about 86% less', id: 'sekitar 86% lebih sedikit' }, type: 'actual' },
      { label: { en: 'Production progress and adjustment rate', id: 'Progres produksi dan adjustment rate' }, value: { en: 'visible live on dashboards', id: 'terlihat langsung di dashboard' }, type: 'actual' },
    ],
    sections: {
      context: {
        en: 'Inspection results lived on individual line PCs, so progress and adjustment rates were only known after the fact.',
        id: 'Hasil inspeksi berada di masing-masing PC lini, sehingga progres dan adjustment rate baru diketahui setelah kejadian.',
      },
      problem: {
        en: 'There was no live view of production progress or how often adjustments were needed.',
        id: 'Tidak ada tampilan langsung untuk progres produksi atau seberapa sering adjustment diperlukan.',
      },
      approach: {
        en: [
          'A WinForms agent deployed with ClickOnce collects inspection data from each line PC automatically.',
          'Quartz.NET jobs aggregate the data.',
          'SignalR pushes live production progress and adjustment-rate dashboards.',
        ],
        id: [
          'Agen WinForms yang di-deploy dengan ClickOnce mengumpulkan data inspeksi dari setiap PC lini secara otomatis.',
          'Job Quartz.NET mengagregasi data.',
          'SignalR mendorong dashboard progres produksi dan adjustment rate secara langsung.',
        ],
      },
      result: {
        en: [
          'Live production progress and adjustment-rate dashboards fed by automatic data collection.',
          'Engineering time on manual inspection data handling (collecting, cleaning and reporting the data) about 86% less, measured after go-live.',
        ],
        id: [
          'Dashboard progres produksi dan adjustment rate secara langsung, dari pengumpulan data otomatis.',
          'Waktu engineering untuk penanganan data inspeksi manual (mengumpulkan, membersihkan, dan melaporkan data) sekitar 86% lebih sedikit, diukur setelah go-live.',
        ],
      },
    },
    diagram: {
      nodes: [
        { id: 'pc', label: 'Line PC agent (ClickOnce)', col: 0, row: 1, kind: 'external' },
        { id: 'api', label: 'API', col: 1, row: 1, kind: 'service' },
        { id: 'q', label: 'Quartz.NET jobs', col: 1, row: 2, kind: 'service' },
        { id: 'db', label: 'Database', col: 2, row: 2, kind: 'data' },
        { id: 'hub', label: 'SignalR hub', col: 2, row: 1, kind: 'service' },
        { id: 'dash', label: 'Live dashboards', col: 3, row: 1, kind: 'client' },
      ],
      edges: [
        { from: 'pc', to: 'api' },
        { from: 'api', to: 'db' },
        { from: 'q', to: 'db' },
        { from: 'api', to: 'hub' },
        { from: 'hub', to: 'dash', label: 'push' },
      ],
    },
  },
  {
    slug: 'part-approval-certification',
    resumeBullet: 'Supporting contributions (3 further projects)',
    kind: 'contributed',
    title: { en: 'Part Approval Certification Workflow', id: 'Alur Sertifikasi Persetujuan Part' },
    summary: {
      en: 'Online part approval certification preparation and issuing to suppliers. I developed the SQL Server stored procedures.',
      id: 'Persiapan dan penerbitan sertifikasi persetujuan part secara online ke supplier. Saya mengembangkan stored procedure SQL Server.',
    },
    role: { en: 'Developer: SQL Server stored procedures', id: 'Developer: stored procedure SQL Server' },
    tags: ['data'],
    stack: ['SQL Server', 'Stored procedures'],
    metrics: [
      { label: { en: 'Certification preparation', id: 'Persiapan sertifikasi' }, value: { en: 'about 96% faster', id: 'sekitar 96% lebih cepat' }, type: 'actual' },
    ],
    sections: {
      context: {
        en: 'Part approval certificates were prepared by hand and passed through many steps before reaching the supplier.',
        id: 'Sertifikat persetujuan part disiapkan secara manual dan melewati banyak tahap sebelum sampai ke supplier.',
      },
      problem: {
        en: 'Preparation took long, certificate data could be lost or wait at one stage, and the process used large volumes of paper and ink.',
        id: 'Persiapan memakan waktu lama, data sertifikat bisa hilang atau tertahan di satu tahap, dan proses memakai banyak kertas dan tinta.',
      },
      approach: {
        en: [
          'Electronic certification application and approval workflow, with part review and inspection data integrated automatically.',
          'Certificates issued to suppliers automatically after approval.',
          'My part: developing the SQL Server stored procedures that implement the data logic.',
        ],
        id: [
          'Pengajuan sertifikasi dan alur persetujuan elektronik, dengan data part review dan inspeksi terintegrasi otomatis.',
          'Sertifikat diterbitkan otomatis ke supplier setelah disetujui.',
          'Bagian saya: mengembangkan stored procedure SQL Server yang mengimplementasikan logika data.',
        ],
      },
      result: {
        en: ['Certification preparation about 96% faster.', 'Paper and ink for certification eliminated.'],
        id: ['Persiapan sertifikasi sekitar 96% lebih cepat.', 'Kertas dan tinta untuk sertifikasi dihilangkan.'],
      },
    },
  },
  {
    slug: 'operator-cycle-time-monitoring',
    resumeBullet: 'Supporting contributions (3 further projects)',
    kind: 'contributed',
    title: { en: 'Operator Work-Cycle Time Monitoring', id: 'Monitoring Waktu Siklus Kerja Operator' },
    summary: {
      en: 'Real-time monitoring of operator work cycles. I implemented the WebSocket communication with SignalR.',
      id: 'Monitoring siklus kerja operator secara real-time. Saya mengimplementasikan komunikasi WebSocket dengan SignalR.',
    },
    role: { en: 'Developer: real-time WebSocket layer', id: 'Developer: lapisan WebSocket real-time' },
    tags: ['realtime'],
    stack: ['SignalR', 'WebSocket'],
    metrics: [],
    sections: {
      context: {
        en: 'Production needed to see operator work-cycle times as they happen, not after a shift ends.',
        id: 'Produksi perlu melihat waktu siklus kerja operator saat terjadi, bukan setelah shift berakhir.',
      },
      problem: {
        en: 'Cycle-time data had to reach screens continuously and reliably.',
        id: 'Data waktu siklus harus sampai ke layar secara terus-menerus dan andal.',
      },
      approach: {
        en: ['Implemented the WebSocket communication using SignalR so cycle-time updates are pushed to monitoring screens.'],
        id: ['Mengimplementasikan komunikasi WebSocket dengan SignalR agar pembaruan waktu siklus didorong ke layar monitoring.'],
      },
      result: {
        en: ['Real-time delivery of cycle-time data to monitoring screens.'],
        id: ['Pengiriman data waktu siklus secara real-time ke layar monitoring.'],
      },
    },
  },
  {
    slug: 'printer-function-test-summary',
    resumeBullet: 'Supporting contributions (3 further projects)',
    kind: 'contributed',
    title: { en: 'Printer Function-Test Data Summary', id: 'Ringkasan Data Function Test Printer' },
    summary: {
      en: 'Summary of function-test data for printers on the production line. I acted as code reviewer.',
      id: 'Ringkasan data function test untuk printer di lini produksi. Saya berperan sebagai code reviewer.',
    },
    role: { en: 'Code reviewer', id: 'Code reviewer' },
    tags: ['data'],
    stack: ['Code review'],
    metrics: [],
    sections: {
      context: {
        en: 'Function-test results for printers are produced on the production line and need to be summarised.',
        id: 'Hasil function test printer dihasilkan di lini produksi dan perlu diringkas.',
      },
      problem: {
        en: 'The summary system needed an independent review of its code before release.',
        id: 'Sistem ringkasan membutuhkan review kode independen sebelum rilis.',
      },
      approach: {
        en: ['Reviewed the code for correctness, maintainability and consistency with team standards.'],
        id: ['Meninjau kode dari sisi kebenaran, keterpeliharaan, dan konsistensi dengan standar tim.'],
      },
      result: {
        en: ['Code reviewed prior to release.'],
        id: ['Kode ditinjau sebelum rilis.'],
      },
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
/** Systems whose headline result is shown as the proof strip on the home page and on its share card. */
export const proofSlugs = ['parts-engineering-management', 'production-file-distribution', 'part-approval-certification', 'production-planning-scheduling'];
export const featured = ['parts-engineering-management', 'production-file-distribution', 'production-planning-scheduling'];
