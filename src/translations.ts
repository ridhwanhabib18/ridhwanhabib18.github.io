import { roles } from './content/experience';
import { profile } from './content/profile';
import { projects } from './content/projects';
import { resumeVariants } from './content/resume';
import { en, id } from './i18n/strings';

/**
 * Every English/Indonesian pair on the site, flattened into rows so a native speaker can review the translations.
 * `npm run translations` turns these into docs/translation-review.md.
 */

export interface TranslationRow {
  area: string;
  where: string;
  en: string;
  id: string;
  /** Indonesian equals English: fine for names and technology terms, worth a look for sentences. */
  same: boolean;
}

const row = (area: string, where: string, e: string, i: string): TranslationRow => ({ area, where, en: e, id: i, same: e === i });

function walk(value: unknown, area: string, path: string, out: TranslationRow[]) {
  if (!value || typeof value !== 'object') return;
  const o = value as Record<string, unknown>;
  if ('en' in o && 'id' in o && Object.keys(o).length === 2) {
    if (Array.isArray(o.en) && Array.isArray(o.id)) o.en.forEach((x, n) => out.push(row(area, `${path} #${n + 1}`, String(x), String((o.id as unknown[])[n] ?? ''))));
    else out.push(row(area, path, String(o.en), String(o.id)));
    return;
  }
  for (const [k, v] of Object.entries(o)) walk(v, area, path ? `${path} / ${k}` : k, out);
}

export function translationRows(): TranslationRow[] {
  const out: TranslationRow[] = [];
  for (const key of Object.keys(en)) out.push(row('Interface texts', key, en[key], id[key] ?? ''));
  walk(profile, 'Profile and About', 'profile', out);
  for (const v of resumeVariants) walk({ label: v.label, target: v.target, summary: v.summary }, 'Resume variants', v.key, out);
  for (const r of roles) walk(r.bullets.map((b) => ({ title: b.title, text: b.text })), 'Experience', r.company, out);
  for (const p of projects) walk({ title: p.title, summary: p.summary, role: p.role, metrics: p.metrics, sections: p.sections }, 'Case studies', p.slug, out);
  return out;
}
