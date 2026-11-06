import { describe, expect, it } from 'vitest';
import { personalProjects } from '../content/personal-projects';
import { render } from '../entry-server';

/**
 * Personal projects are not resume case studies, so they skip the resume guards, but they have their own: everything is
 * bilingual, links are public GitHub pages of the owner, and no employer or internal material appears in them.
 */

const flat = (p: (typeof personalProjects)[number]) => p.stackGroups.flatMap((g) => g.items);

describe('personal projects', () => {
  it('have a bilingual, complete description', () => {
    expect(personalProjects.length).toBeGreaterThan(0);
    for (const p of personalProjects) {
      for (const v of [p.title, p.summary, p.status, p.role]) {
        expect(v.en.trim(), p.slug).not.toBe('');
        expect(v.id.trim(), p.slug).not.toBe('');
      }
      expect(p.highlights.id.length, `${p.slug} highlights`).toBe(p.highlights.en.length);
      expect(p.stackGroups.length, `${p.slug} stack`).toBeGreaterThan(0);
      for (const g of p.stackGroups) expect(g.items.length, `${p.slug} ${g.group.en}`).toBeGreaterThan(0);
      expect(p.year).toMatch(/^20\d\d$/);
    }
    expect(new Set(personalProjects.map((p) => p.slug)).size).toBe(personalProjects.length);
  });

  it('list each technology once and name the whole documented SchoMans stack', () => {
    const items = flat(personalProjects.find((p) => p.slug === 'schomans')!);
    expect(new Set(items).size, 'a technology is listed twice').toBe(items.length);
    for (const tech of ['.NET 10', 'Entity Framework Core 10', 'SQL Server 2022', 'Keycloak', 'SignalR', 'Hangfire', 'QuestPDF', 'ClosedXML', 'PdfPig', 'React 19', 'TanStack Query', 'Zustand', 'react-i18next', 'oidc-client-ts', 'Recharts', 'orval', 'Testcontainers', 'Playwright', 'Docker Compose', 'Caddy', 'Serilog', 'Seq', 'Claude API', 'Ollama']) {
      expect(items, tech).toContain(tech);
    }
  });

  it('link only to public GitHub pages of the owner', () => {
    for (const p of personalProjects) {
      expect(p.links.length, p.slug).toBeGreaterThan(0);
      for (const x of p.links) expect(x.href, `${p.slug}: ${x.label.en}`).toMatch(/^https:\/\/github\.com\/ridhwanhabib18\/[\w.-]+(\/(blob|tree)\/main\/[\w./-]+)?$/);
    }
  });

  it('contain no employer or internal material', () => {
    const text = JSON.stringify(personalProjects);
    expect(text).not.toMatch(/epson|indonesia epson|\busd\b|\$\s?\d/i);
    expect(text).not.toMatch(/\+?\d[\d\s-]{9,}\d/); // no phone-like numbers
  });

  it('are shown on the Projects page in both languages, apart from the professional work', () => {
    for (const [route, personalHeading, professionalHeading] of [['/work', 'Personal projects', 'Professional'], ['/id/work', 'Proyek pribadi', 'Profesional']]) {
      const html = render(route).html;
      expect(html, route).toContain(personalHeading);
      expect(html, route).toContain(professionalHeading);
      expect(html.indexOf(professionalHeading), `${route}: professional work first`).toBeLessThan(html.indexOf(personalHeading));
      expect(html, route).toContain('github.com/ridhwanhabib18/schomans');
    }
  });
});
