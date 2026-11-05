import { describe, expect, it } from 'vitest';
import { en, id } from '../i18n/strings';
import { projects, featured } from '../content/projects';
import { roles } from '../content/experience';
import { profile } from '../content/profile';
import { resumeVariants } from '../content/resume';
// @ts-expect-error plain ESM helper without types
import { findViolations, loadBlocklist } from '../../scripts/guardrail-lib.mjs';

/** Collect every {en,id} pair in a value. */
function pairs(v: unknown, out: { en: unknown; id: unknown; at: string }[] = [], at = ''): typeof out {
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if ('en' in o && 'id' in o && Object.keys(o).length === 2) out.push({ en: o.en, id: o.id, at });
    else for (const [k, x] of Object.entries(o)) pairs(x, out, `${at}.${k}`);
  }
  return out;
}

const nonEmpty = (x: unknown): boolean => (Array.isArray(x) ? x.length > 0 && x.every(nonEmpty) : typeof x === 'string' && x.trim().length > 0);

describe('i18n', () => {
  it('has the same keys in English and Indonesian', () => {
    expect(Object.keys(id).sort()).toEqual(Object.keys(en).sort());
  });
  it('has no empty strings', () => {
    for (const [k, v] of [...Object.entries(en), ...Object.entries(id)]) expect(v.trim(), k).not.toBe('');
  });
});

describe('content', () => {
  const all = { profile, projects, roles, resumeVariants };

  it('has both languages for every bilingual field, and arrays of equal length', () => {
    for (const p of pairs(all)) {
      expect(nonEmpty(p.en), `${p.at} en`).toBe(true);
      expect(nonEmpty(p.id), `${p.at} id`).toBe(true);
      if (Array.isArray(p.en)) expect((p.id as unknown[]).length, `${p.at} length`).toBe(p.en.length);
    }
  });

  it('labels every metric as actual or target', () => {
    for (const p of projects) for (const m of p.metrics) expect(['actual', 'target']).toContain(m.type);
  });

  it('has unique slugs and valid featured and role references', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of featured) expect(slugs).toContain(s);
    for (const r of roles) for (const s of r.projectSlugs) expect(slugs).toContain(s);
  });

  it('has 5 delivered and 3 contributed projects', () => {
    expect(projects.filter((p) => p.kind === 'delivered')).toHaveLength(5);
    expect(projects.filter((p) => p.kind === 'contributed')).toHaveLength(3);
  });

  it('references real diagram nodes', () => {
    for (const p of projects) {
      if (!p.diagram) continue;
      const ids = new Set(p.diagram.nodes.map((n) => n.id));
      for (const e of p.diagram.edges) {
        expect(ids.has(e.from), `${p.slug} ${e.from}`).toBe(true);
        expect(ids.has(e.to), `${p.slug} ${e.to}`).toBe(true);
      }
    }
  });
});

describe('confidentiality guardrail', () => {
  const blocklist: string[] = loadBlocklist();
  const text = JSON.stringify({ profile, projects, roles, resumeVariants, en, id });

  it('finds no currency, hour counts or blocklisted code names in published content', () => {
    expect(findViolations(text, blocklist)).toEqual([]);
  });

  it('detects the patterns it is meant to catch', () => {
    expect(findViolations('saved USD 12', [])).not.toEqual([]);
    expect(findViolations('saved $5', [])).not.toEqual([]);
    expect(findViolations('about 500 hours a year', [])).not.toEqual([]);
    expect(findViolations('thousands of manhours', [])).not.toEqual([]);
    expect(findViolations('uses Secret-X internally', ['Secret-X'])).not.toEqual([]);
    expect(findViolations('about 86% faster, hours to minutes', [])).toEqual([]);
  });
});
