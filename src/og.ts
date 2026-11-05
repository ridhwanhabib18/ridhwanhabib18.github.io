import { profile } from './content/profile';
import { getProject, proofSlugs } from './content/projects';
import type { Lang, Metric } from './content/types';
import { dictionaries } from './i18n/strings';

/**
 * Content for the Open Graph share cards (the preview image shown when a link is shared).
 * Everything comes from the same content files as the site, so the cards cannot drift from it.
 * Pages other than the home page and the case studies use their own title and description.
 */

export interface OgMetric {
  tone: 'actual' | 'target';
  /** "Actual" / "Target" in the page language. */
  badge: string;
  value: string;
  label: string;
}

export interface OgExtras {
  kind: 'home' | 'case' | 'page';
  lang: Lang;
  /** Shown in the footer of every card. */
  name: string;
  role: string;
  /** Small label above the title (the headline on the home card, "Delivered" or "Contributed" on case studies). */
  kicker?: string;
  title?: string;
  description?: string;
  metrics: OgMetric[];
  chips: string[];
}

export function ogExtras(route: string): OgExtras {
  const lang: Lang = route === '/id' || route.startsWith('/id/') ? 'id' : 'en';
  const bare = route.replace(/^\/id(?=\/|$)/, '') || '/';
  const t = (key: string) => dictionaries[lang][key] ?? dictionaries.en[key];
  const metric = (m: Metric): OgMetric => ({ tone: m.type, badge: t(`badge.${m.type}`), value: m.value[lang], label: m.label[lang] });

  if (bare === '/') {
    return {
      kind: 'home',
      lang,
      name: profile.name,
      role: profile.headline[lang],
      kicker: profile.headline[lang],
      title: profile.name,
      description: profile.positioning[lang],
      metrics: proofSlugs.slice(0, 3).map((s) => metric(getProject(s)!.metrics[0])),
      chips: [],
    };
  }

  const m = bare.match(/^\/work\/([^/]+)$/);
  const project = m ? getProject(m[1]) : undefined;
  if (project) {
    return {
      kind: 'case',
      lang,
      name: profile.name,
      role: profile.headline[lang],
      kicker: t(`badge.${project.kind}`),
      title: project.title[lang],
      description: project.summary[lang],
      metrics: project.metrics.slice(0, 3).map(metric),
      chips: project.stack.slice(0, 5),
    };
  }

  return { kind: 'page', lang, name: profile.name, role: profile.headline[lang], metrics: [], chips: [] };
}
