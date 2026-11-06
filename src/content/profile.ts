import { degreeName, gpaOf, resumeData, toL10n } from './resume-data';
import type { L10n } from './types';

const r = resumeData;
const edu = r.education[0];

interface CertMeta {
  issuer: string;
  level: L10n;
  /** Badge image in public/certs/, downloaded from the Credly badge page. */
  image: string;
  /** ISO dates as shown on the Credly badge page. */
  issued: string;
  expires: string;
  summary: L10n;
}

/** Extra display data for certifications; the names and verify links come from the Typst source, the rest from the Credly badge pages. */
const certMeta: Record<string, CertMeta> = {
  'CLF-C02': {
    issuer: 'Amazon Web Services Training and Certification',
    level: { en: 'Foundational', id: 'Foundational' },
    image: 'certs/aws-cloud-practitioner.png',
    issued: '2026-10-08',
    expires: '2029-10-08',
    summary: {
      en: 'Foundational understanding of IT services and their uses in the AWS Cloud, and the essential AWS services needed to set up AWS-focused projects.',
      id: 'Pemahaman dasar tentang layanan TI dan penggunaannya di AWS Cloud, serta layanan AWS penting untuk menyiapkan proyek berbasis AWS.',
    },
  },
  'AIF-C01': {
    issuer: 'Amazon Web Services Training and Certification',
    level: { en: 'Foundational', id: 'Foundational' },
    image: 'certs/aws-ai-practitioner.png',
    issued: '2026-09-24',
    expires: '2029-09-24',
    summary: {
      en: 'AI, machine learning and generative AI concepts in general and on AWS, choosing the right AI/ML technology for a use case, and using it responsibly.',
      id: 'Konsep AI, machine learning, dan generative AI secara umum dan di AWS, memilih teknologi AI/ML yang tepat untuk suatu kasus, serta menggunakannya secara bertanggung jawab.',
    },
  },
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
    en: 'Full Stack Software Engineer (.NET)',
    id: 'Full Stack Software Engineer (.NET)',
  } as L10n,
  positioning: {
    en: 'I turn manufacturing requirements into reliable production software—from business case and system design to deployment and production support.',
    id: 'Saya menerjemahkan kebutuhan manufaktur menjadi perangkat lunak produksi yang andal—dari business case dan desain sistem hingga deployment dan dukungan produksi.',
  } as L10n,
  /** Roles shown one at a time (typed) under the headline; the first is the one in the pre-rendered HTML. */
  alsoRoles: {
    en: ['System Analyst', 'Full Stack Software Engineer', 'Full Stack .NET Developer', 'Backend & API Integration', 'Web Development', 'Desktop & Mobile Development', 'Internet of Things (IoT)', 'Embedded Systems'],
    id: ['System Analyst', 'Full Stack Software Engineer', 'Full Stack .NET Developer', 'Backend & API Integration', 'Web Development', 'Desktop & Mobile Development', 'Internet of Things (IoT)', 'Embedded Systems'],
  } as L10n<string[]>,
  availability: {
    en: 'Open to Tech Lead, Senior Software Engineer (.NET), Full Stack Developer, and System Analyst roles',
    id: 'Terbuka untuk peran Tech Lead, Senior Software Engineer (.NET), Full Stack Developer, dan System Analyst',
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
      icon: 'workflow' as const,
      title: { en: 'System design', id: 'Desain sistem' } as L10n,
      body: {
        en: 'Layered architecture, PRDs, system designs, ERDs and ADRs, so knowledge does not live in one person’s head.',
        id: 'Arsitektur berlapis, PRD, desain sistem, ERD, dan ADR, agar pengetahuan tidak hanya ada di kepala satu orang.',
      } as L10n,
    },
    {
      icon: 'shield' as const,
      title: { en: 'Quality', id: 'Kualitas' } as L10n,
      body: {
        en: 'GitHub Actions CI/CD, tests on every pull request, API and database integration tests, and code reviews.',
        id: 'CI/CD GitHub Actions, tes pada setiap pull request, tes integrasi API dan database, serta code review.',
      } as L10n,
    },
    {
      icon: 'plug' as const,
      title: { en: 'Integration', id: 'Integrasi' } as L10n,
      body: {
        en: 'Keycloak SSO, AWS, background jobs (Quartz.NET, Hangfire) and real-time dashboards (SignalR).',
        id: 'Keycloak SSO, AWS, background job (Quartz.NET, Hangfire), dan dashboard real-time (SignalR).',
      } as L10n,
    },
    {
      icon: 'users' as const,
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
    return { name: c.name, url: c.url, issuer: meta?.issuer ?? '', level: meta?.level, image: meta?.image, issued: meta?.issued, expires: meta?.expires, summary: meta?.summary };
  }),
  education: {
    /** Emblem of the university, cropped from its logo (CC BY 4.0, see the footer credit); in public/. */
    logo: 'ugm-emblem.png',
    /** The undergraduate thesis in the university repository; the card on About opens it. */
    thesisUrl: 'https://etd.repository.ugm.ac.id/home/detail_pencarian/217482',
    school: edu.institution,
    degree: toL10n(degreeName(edu.degree)),
    location: edu.location,
    period: `${edu.start} – ${edu.end}`,
    gpa: gpaOf(edu.degree).replace(/^GPA\s*/, ''),
  },
};
