import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { icons, personalIcons, tagIcons } from '../components/icons';
import { personalProjects } from '../content/personal-projects';
import { profile } from '../content/profile';
import { projects } from '../content/projects';
import { render } from '../entry-server';

/** The icon system: every thing that gets an icon has one, icons are decorations only, and they are drawn with one line weight. */

const names = new Set(Object.keys(icons));

describe('icon system', () => {
  it('has an icon for everything that is decorated', () => {
    for (const p of personalProjects) {
      for (const f of p.features) expect(personalIcons.features, `feature ${f.id}`).toHaveProperty(f.id);
      for (const r of p.roles) expect(personalIcons.roles, `role ${r.name.en}`).toHaveProperty(r.name.en);
      for (const q of p.qualityGoals) expect(personalIcons.quality, `quality goal ${q.goal.en}`).toHaveProperty(q.goal.en);
      for (const d of p.design) expect(personalIcons.design, `design ${d.title.en}`).toHaveProperty(d.title.en);
      for (const g of p.stackGroups) expect(personalIcons.stack, `stack group ${g.group.en}`).toHaveProperty(g.group.en);
      for (const t of p.tags) expect(tagIcons, `tag ${t}`).toHaveProperty(t);
    }
    for (const p of projects) for (const t of p.tags) expect(tagIcons, `tag ${t}`).toHaveProperty(t);
    for (const h of profile.howIWork) expect(names.has(h.icon), `How I work: ${h.title.en}`).toBe(true);
  });

  it('only refers to icons that exist', () => {
    for (const group of [tagIcons, ...Object.values(personalIcons)]) for (const [key, name] of Object.entries(group)) expect(names.has(name), `${key} -> ${name}`).toBe(true);
  });

  it('keeps every icon a decoration: hidden from assistive technology on every page', () => {
    for (const route of ['/', '/id/', '/work', '/about', '/contact', '/experience', '/work/schomans', '/id/work/schomans']) {
      const html = render(route).html;
      const svgs = (html.match(/<svg [^>]*>/g) ?? []).filter((tag) => !tag.includes('role="img"')); // the architecture diagrams are content, with a label of their own
      expect(svgs.length, `${route} has icons`).toBeGreaterThan(3);
      for (const tag of svgs) expect(tag, `${route}: ${tag.slice(0, 80)}`).toContain('aria-hidden="true"');
    }
  });

  it('draws every icon with one line weight', () => {
    expect(readFileSync('src/styles/globals.css', 'utf8')).toMatch(/svg\.lucide\s*\{\s*stroke-width:\s*1\.75;/);
  });
});
