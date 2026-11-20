import { describe, expect, it } from 'vitest';
import { render, routes } from '../entry-server';
import { personalProjects } from '../content/personal-projects';
import { projects } from '../content/projects';
import { recommendationPages } from '../content/recommendations';

// Renders every route; under a full parallel run this can take longer than the 5 s default.
describe('pre-render entry', { timeout: 30_000 }, () => {
  it('lists every page in both languages', () => {
    const pageCount = 7 + recommendationPages.length + projects.length + personalProjects.length;
    expect(routes).toHaveLength(pageCount * 2);
    expect(routes).toContain('/');
    expect(routes).toContain('/id');
    expect(routes).toContain('/id/work/production-planning-scheduling');
    expect(routes).toContain('/recommendations');
    expect(routes).toContain('/id/recommendations');
    expect(routes).toContain('/recommendations/seven-books-career-restart');
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

});
