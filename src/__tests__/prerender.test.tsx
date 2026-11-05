import { describe, expect, it } from 'vitest';
import { render, routes } from '../entry-server';
import { projects } from '../content/projects';

describe('pre-render entry', () => {
  it('lists every page in both languages', () => {
    const pageCount = 7 + projects.length;
    expect(routes).toHaveLength(pageCount * 2);
    expect(routes).toContain('/');
    expect(routes).toContain('/id');
    expect(routes).toContain('/id/work/production-planning-scheduling');
  });

  it('provides unique head metadata for every route', () => {
    const titles = new Set<string>();
    for (const r of routes) {
      const { html, head } = render(r);
      expect(head, r).toBeDefined();
      expect(html, r).toContain('<h1');
      expect(head!.description.length, r).toBeGreaterThan(10);
      titles.add(`${head!.lang}|${head!.title}`);
    }
    expect(titles.size).toBe(routes.length);
  });

  it('sets language, canonical and hreflang alternates', () => {
    const en = render('/work').head!;
    const id = render('/id/work').head!;
    expect(en.lang).toBe('en');
    expect(id.lang).toBe('id');
    expect(en.canonical).toMatch(/\/work\/$/);
    expect(id.canonical).toMatch(/\/id\/work\/$/);
    expect(en.alternates.id).toBe(id.canonical);
    expect(id.alternates.en).toBe(en.canonical);
  });

  it('renders the demo page shell with its heading even though the panels load on the client', () => {
    const { html } = render('/demo');
    expect(html).toContain('Live demo');
    expect(html).toContain('aria-busy="true"');
  });
});
