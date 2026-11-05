import { profile } from '@/content/profile';
import { resumeData } from '@/content/resume-data';
import { absoluteUrl, SITE } from './site';

/**
 * schema.org structured data (JSON-LD) so search engines can recognise the site as the portfolio of a person.
 * Built from the same content as the pages. The phone number and the email address are deliberately not included.
 */

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const home = `${SITE}${base}/`;
const current = resumeData.experience[0];
const school = resumeData.education[0];

const technologies = [
  ...new Set(
    resumeData.skills
      .slice(0, 5)
      .flatMap((s) => s.items)
      .map((i) => i.replace(/\s*\(.*\)\s*$/, '').trim()),
  ),
].slice(0, 20);

export const personLd = () => ({
  '@type': 'Person',
  '@id': `${home}#person`,
  name: profile.name,
  jobTitle: profile.headline.en,
  description: profile.positioning.en,
  url: home,
  image: `${home}${profile.photo}`,
  sameAs: [profile.linkedin, profile.github],
  worksFor: { '@type': 'Organization', name: current.company },
  alumniOf: { '@type': 'CollegeOrUniversity', name: school.institution },
  knowsAbout: technologies,
  address: { '@type': 'PostalAddress', addressRegion: 'West Java', addressCountry: 'ID' },
});

export const websiteLd = () => ({
  '@type': 'WebSite',
  '@id': `${home}#website`,
  url: home,
  name: 'Ridhwan Habib',
  inLanguage: ['en', 'id'],
  publisher: { '@id': `${home}#person` },
});

/** Items are router paths, already including the language prefix. */
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
