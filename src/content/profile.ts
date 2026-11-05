import { degreeName, gpaOf, resumeData, toL10n } from './resume-data';
import type { L10n } from './types';

const r = resumeData;
const edu = r.education[0];

/** Extra display data for certifications; the names and links come from the Typst source. */
const certMeta: Record<string, { issuer: string; level: L10n }> = {
  'CLF-C02': { issuer: 'Amazon Web Services', level: { en: 'Foundational', id: 'Foundational' } },
  'AIF-C01': { issuer: 'Amazon Web Services', level: { en: 'Foundational', id: 'Foundational' } },
};

export const profile = {
  // Identity and links come from resume/resume_us.typ. The phone number is never published.
  name: r.name,
  shortName: 'Ridhwan',
  /** Profile photo in public/. Square, resized and stripped of metadata (a test checks this). */
  photo: 'profile.jpg',
  email: r.email,
  linkedin: `https://www.${r.linkedin}`,
  linkedinText: r.linkedin,
  github: `https://${r.github}`,
  githubText: r.github,
  location: toL10n(r.location),
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
  // Skills, certifications and education come from the Typst resume source.
  stack: r.skills.map((g) => ({ group: toL10n(g.group), items: g.items })),
  certifications: r.certifications.map((c) => {
    const code = c.name.match(/\(([A-Z0-9-]+)\)\s*$/)?.[1] ?? '';
    const meta = certMeta[code];
    return { name: c.name, issuer: meta?.issuer ?? '', level: meta?.level, url: c.url };
  }),
  education: {
    school: edu.institution,
    degree: toL10n(degreeName(edu.degree)),
    location: edu.location,
    period: `${edu.start} – ${edu.end}`,
    gpa: gpaOf(edu.degree).replace(/^GPA\s*/, ''),
  },
};
