import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { personalProjects } from '../content/personal-projects';
import { projects } from '../content/projects';
import { render, routes } from '../entry-server';

/**
 * Personal projects are not resume case studies, so they skip the resume guards, but they have their own: everything is
 * bilingual, links are public GitHub pages of the owner, the pictures exist with the sizes stated, each project has a state
 * (done or in progress) and its own page, and no employer material or credentials appear.
 */

const flat = (p: (typeof personalProjects)[number]) => p.stackGroups.flatMap((g) => g.items);
const strings = (v: unknown): string[] => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
const both = (v: { en: string; id: string }, label: string) => {
  expect(v.en.trim(), `${label} (en)`).not.toBe('');
  expect(v.id.trim(), `${label} (id)`).not.toBe('');
};

function imageSize(file: string): [number, number] {
  const b = readFileSync(`public/projects/${file}`);
  if (b.subarray(1, 4).toString('latin1') === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.subarray(0, 3).toString('latin1') === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
  if (file.endsWith('.svg')) {
    const svg = b.toString('utf8');
    return [Number(svg.match(/<svg[^>]*\swidth="(\d+)"/)![1]), Number(svg.match(/<svg[^>]*\sheight="(\d+)"/)![1])];
  }
  throw new Error(`${file} is neither a PNG, a GIF nor an SVG`);
}

describe('personal projects', () => {
  it('have a state and a bilingual, complete description', () => {
    expect(personalProjects.length).toBeGreaterThan(0);
    for (const p of personalProjects) {
      expect(['done', 'in-progress'], p.slug).toContain(p.state);
      for (const [k, v] of Object.entries({ title: p.title, summary: p.summary, status: p.status, role: p.role })) both(v, `${p.slug} ${k}`);
      expect(p.highlights.id.length, `${p.slug} highlights`).toBe(p.highlights.en.length);
      expect(p.overview.id.length, `${p.slug} overview`).toBe(p.overview.en.length);
      for (const g of p.stackGroups) expect(g.items.length, `${p.slug} ${g.group.en}`).toBeGreaterThan(0);
      for (const x of [...p.roles.flatMap((r) => [r.name, r.needs]), ...p.features.flatMap((f) => [f.title, f.note]), ...p.aiFeatures.map((a) => a.title), ...p.qualityGoals.flatMap((q) => [q.goal, q.target, q.response]), ...p.decisions.flatMap((d) => [d.title, d.summary]), ...p.phases.map((x) => x.scope), ...p.docs.map((d) => d.label), ...p.gallery.map((g) => g.caption)]) both(x, p.slug);
      for (const d of p.design) {
        both(d.title, `${p.slug} design`);
        expect(d.body.id.length, `${p.slug} ${d.title.en}`).toBe(d.body.en.length);
      }
      for (const d of p.architecture.diagrams) {
        const ids = new Set(d.def.nodes.map((n) => n.id));
        for (const e of d.def.edges) expect(ids.has(e.from) && ids.has(e.to), `${p.slug} diagram edge ${e.from} -> ${e.to}`).toBe(true);
      }
      expect(p.year).toMatch(/^20\d\d$/);
    }
    const slugs = [...personalProjects.map((p) => p.slug), ...projects.map((p) => p.slug)];
    expect(new Set(slugs).size, 'a slug is used twice').toBe(slugs.length);
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
      // a project whose repository is private has no links yet (the page leaves those parts out); any link that exists must be public
      const all = [...p.links.map((x) => x.href), ...p.docs.map((x) => x.href), ...p.decisions.flatMap((x) => (x.href ? [x.href] : []))];
      for (const href of all) expect(href, `${p.slug}: ${href}`).toMatch(/^https:\/\/github\.com\/ridhwanhabib18\/[\w.-]+(\/(blob|tree)\/main\/[\w./-]+)?$/);
    }
  });

  it('ship their pictures, with the sizes stated, and a phase list that agrees with the state', () => {
    for (const p of personalProjects) {
      expect(p.gallery.length, p.slug).toBeGreaterThan(0);
      for (const g of p.gallery) {
        const file = `${p.slug}/${g.file}`;
        expect(existsSync(`public/projects/${file}`), `${file} exists`).toBe(true);
        expect(imageSize(file), `${file} size`).toEqual([g.width, g.height]);
      }
      expect(p.phases.map((x) => x.n), p.slug).toEqual(p.phases.map((_, i) => i + 1));
      if (p.state === 'done') expect(p.phases.every((x) => x.done), `${p.slug} is done, so every phase is`).toBe(true);
    }
  });

  it('contain no employer or internal material, and no credentials', () => {
    const text = strings(personalProjects).join('\n');
    expect(text).not.toMatch(/epson|\busd\b|\$\s?\d/i);
    expect(text).not.toMatch(/\+?\d[\d\s-]{9,}\d/); // no phone-like numbers
    expect(text).not.toMatch(/password|passwd|secret=|api[_-]?key|token=|Demo123|@schomans\.demo/i);
  });

  it('are shown on the Projects page in both languages, apart from the professional work, and open their own page', () => {
    for (const [route, personalHeading, professionalHeading, doneLabel] of [['/work', 'Personal projects', 'Professional', 'Done'], ['/id/work', 'Proyek pribadi', 'Profesional', 'Selesai']]) {
      const html = render(route).html;
      expect(html, route).toContain(personalHeading);
      expect(html, route).toContain(professionalHeading);
      expect(html.indexOf(professionalHeading), `${route}: professional work first`).toBeLessThan(html.indexOf(personalHeading));
      expect(html, route).toContain(doneLabel);
      expect(html, route).toMatch(/href="(\/id)?\/work\/schomans"/);
    }
  });

  it('have their own page in both languages, with every section and the pictures', () => {
    expect(routes).toContain('/work/schomans');
    expect(routes).toContain('/id/work/schomans');
    for (const [route, expected] of [
      ['/work/schomans', ['Done', 'Overview', 'Features', 'System architecture', 'System design', 'Key decisions (ADRs)', 'Tech stack', 'Build phases', 'Documentation', 'Getting started', 'Screenshots and flows', 'ADR-005', 'F-03', 'Clean Architecture']],
      ['/id/work/schomans', ['Selesai', 'Ringkasan', 'Fitur', 'Arsitektur sistem', 'Desain sistem', 'Keputusan penting (ADR)', 'Fase pengerjaan', 'Dokumentasi', 'Cara memulai', 'Tangkapan layar dan alur', 'ADR-005', 'F-03']],
    ] as [string, string[]][]) {
      const { html, head } = render(route);
      for (const text of expected) expect(html, `${route}: ${text}`).toContain(text);
      expect(head?.title, route).toContain('SchoMans');
      expect(html.match(/<img /g)?.length ?? 0, `${route} images`).toBeGreaterThanOrEqual(personalProjects[0].gallery.length);
      expect((html.match(/<img [^>]*alt=""/g) ?? []).length, `${route} images without a description`).toBe(0);
      expect(html, route).toContain('projects/schomans/flows/qr-attendance.gif');
    }
  });

  it('show the Coffee Roasto page in both languages, with links to its public repository', () => {
    expect(routes).toContain('/work/coffee-roasto');
    expect(routes).toContain('/id/work/coffee-roasto');
    const p = personalProjects.find((x) => x.slug === 'coffee-roasto')!;
    expect(p.links[0]?.href).toBe('https://github.com/ridhwanhabib18/capstone-coffee-roasto');
    expect(p.docs.length).toBeGreaterThan(0);
    expect(p.decisions.every((d) => d.href?.includes('/capstone-coffee-roasto/blob/main/docs/en/adr/'))).toBe(true);
    for (const [route, expected, absent] of [
      ['/work/coffee-roasto', ['Done', 'Overview', 'Features', 'FR-9', 'Control loop (PID on the Arduino)', 'Known limitations', 'Key decisions (ADRs)', 'ADR-006', 'Tech stack', 'WPF-UI 4 (Fluent)', 'Getting started', 'Screenshots and flows', 'Read the decision record'], ['id="p-phases"']],
      ['/id/work/coffee-roasto', ['Selesai', 'Ringkasan', 'Fitur', 'FR-9', 'Loop kendali (PID di Arduino)', 'Keterbatasan yang diketahui', 'ADR-006', 'Cara memulai'], ['id="p-phases"']],
    ] as [string, string[], string[]][]) {
      const { html, head } = render(route);
      for (const text of expected) expect(html, `${route}: ${text}`).toContain(text);
      for (const text of absent) expect(html, `${route} has no ${text}`).not.toContain(text);
      expect(head?.title, route).toContain('Coffee Roasto');
      expect(html, route).toContain('projects/coffee-roasto/flows/pid-roast.gif');
      expect((html.match(/<img [^>]*alt=""/g) ?? []).length, `${route} images without a description`).toBe(0);
      expect(html.match(/<img /g)?.length ?? 0, `${route} images`).toBeGreaterThanOrEqual(p.gallery.length);
    }
  });

  it('have a share image like every other page', () => {
    for (const route of ['/work/schomans', '/id/work/schomans']) {
      const { head } = render(route);
      expect(head?.image, route).toMatch(/\/og\/.+\.png$/);
    }
  });
});
