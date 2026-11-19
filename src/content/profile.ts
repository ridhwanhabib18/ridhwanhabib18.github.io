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
      en: 'Core AWS Cloud services and what they are used for.',
      id: 'Layanan inti AWS Cloud dan kegunaannya.',
    },
  },
  'AIF-C01': {
    issuer: 'Amazon Web Services Training and Certification',
    level: { en: 'Foundational', id: 'Foundational' },
    image: 'certs/aws-ai-practitioner.png',
    issued: '2026-09-24',
    expires: '2029-09-24',
    summary: {
      en: 'AI, machine learning and generative AI concepts, on AWS and in general, and choosing the right AI/ML tool.',
      id: 'Konsep AI, machine learning, dan generative AI, di AWS dan secara umum, serta memilih teknologi AI/ML yang tepat.',
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
  website: `https://${r.website}`,
  websiteText: r.website,
  location: toL10n(r.location),
  yearsExperience: '4+',
  /** Flip to false to hide the availability badge. */
  available: true,
  headline: {
    en: 'Full Stack Software Engineer (.NET)',
    id: 'Full Stack Software Engineer (.NET)',
  } as L10n,
  positioning: {
    en: 'I build production software for manufacturing, from business case to deployment and support.',
    id: 'Saya membangun perangkat lunak produksi untuk manufaktur, dari business case hingga deployment dan dukungan.',
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
      'Full Stack .NET Engineer and technical lead of a 2-person team at PT Indonesia Epson Industry. In 4+ years I delivered 5 manufacturing systems, from business case to production support.',
      'I studied Electrical Engineering (Universitas Gadjah Mada), so I am at ease where software meets hardware and production lines.',
    ],
    id: [
      'Full Stack .NET Engineer dan technical lead tim 2 orang di PT Indonesia Epson Industry. Dalam 4+ tahun saya menyelesaikan 5 sistem manufaktur, dari business case hingga dukungan produksi.',
      'Saya lulusan Teknik Elektro (Universitas Gadjah Mada), jadi terbiasa di titik temu perangkat lunak, perangkat keras, dan lini produksi.',
    ],
  } as L10n<string[]>,
  howIWork: [
    {
      icon: 'workflow' as const,
      title: { en: 'System design', id: 'Desain sistem' } as L10n,
      body: {
        en: 'Layered architecture, PRDs, system designs, ERDs and ADRs.',
        id: 'Arsitektur berlapis, PRD, desain sistem, ERD, dan ADR.',
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
        en: 'Turn requirements into proposals, present at design reviews, mentor a junior developer.',
        id: 'Mengubah kebutuhan menjadi proposal, presentasi di design review, membimbing junior developer.',
      } as L10n,
    },
  ],
  // Skills, certifications and education come from the Typst resume source.
  stack: r.skills.map((g) => ({ group: toL10n(g.group), items: g.items })),
  /** The technologies shown first, as large chips, on Home and About. Each must be the start of an item in the resume Skills section (a test checks it). */
  coreSkills: ['C#', 'ASP.NET Core', 'SQL Server', 'React', 'TypeScript', 'Entity Framework Core'],
  certifications: r.certifications.map((c) => {
    const code = c.name.match(/\(([A-Z0-9-]+)\)\s*$/)?.[1] ?? '';
    const meta = certMeta[code];
    return { name: c.name, url: c.url, issuer: meta?.issuer ?? '', level: meta?.level, image: meta?.image, issued: meta?.issued, expires: meta?.expires, summary: meta?.summary };
  }),
  education: {
    /** Emblem of the university, cropped from its logo (from brand.ugm.ac.id, CC BY 4.0; the owner chose to show no credit line on the site); in public/. */
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
