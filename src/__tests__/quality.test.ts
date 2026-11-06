import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM helpers without types
import { buildCsp, inlineScriptHashes, withCsp } from '../../scripts/csp-lib.mjs';
import { analyticsEnabled } from '../lib/analytics';
import { splitNumber } from '../components/CountUp';
import { profile } from '../content/profile';
import { projects } from '../content/projects';
import { render } from '../entry-server';
import { en } from '../i18n/strings';
import { translationRows } from '../translations';

const ld = (route: string) => {
  const raw = render(route).head!.jsonLd;
  return raw ? JSON.parse(raw) : undefined;
};

describe('structured data (JSON-LD)', () => {
  it('describes the person and the site on the home page, in both languages', () => {
    for (const route of ['/', '/id']) {
      const g = ld(route);
      expect(g['@context']).toBe('https://schema.org');
      const types = g['@graph'].map((n: { '@type': string }) => n['@type']);
      expect(types).toEqual(expect.arrayContaining(['WebSite', 'Person']));
      const person = g['@graph'].find((n: { '@type': string }) => n['@type'] === 'Person');
      expect(person.name).toBe('Muhammad Ridhwan Habib Abdillah');
      expect(person.sameAs.length).toBeGreaterThanOrEqual(2);
      expect(person.knowsAbout.length).toBeGreaterThan(5);
      expect(person.image).toMatch(/\/profile\.jpg$/);
    }
  });

  it('never publishes the email address or a phone number in structured data', () => {
    const all = JSON.stringify([ld('/'), ld('/about'), ...projects.map((p) => ld(`/work/${p.slug}`))]);
    expect(all).not.toMatch(/@gmail|mailto:|"email"|"telephone"/);
    expect(all).not.toMatch(/\+\d{1,3}[\d ]{8,}/);
  });

  it('gives every case study a three-step breadcrumb and does not put "<" in the page source', () => {
    for (const p of projects) {
      for (const prefix of ['', '/id']) {
        const raw = render(`${prefix}/work/${p.slug}`).head!.jsonLd!;
        expect(raw).not.toContain('<');
        const list = JSON.parse(raw)['@graph'][0];
        expect(list['@type']).toBe('BreadcrumbList');
        expect(list.itemListElement.map((i: { position: number }) => i.position)).toEqual([1, 2, 3]);
        expect(list.itemListElement[2].item).toMatch(new RegExp(`/work/${p.slug}/$`));
      }
    }
  });

  it('leaves plain pages without structured data', () => {
    expect(ld('/contact')).toBeUndefined();
  });
});

describe('icons and manifest', () => {
  const manifest = JSON.parse(readFileSync('public/site.webmanifest', 'utf8'));
  const pngSize = (file: string) => {
    const b = readFileSync(file);
    expect(b.subarray(1, 4).toString('latin1'), `${file} is a PNG`).toBe('PNG');
    return `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;
  };

  it('has a valid manifest whose icons exist at the declared sizes', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
    for (const icon of manifest.icons) {
      const file = `public/${icon.src}`;
      expect(existsSync(file), file).toBe(true);
      expect(pngSize(file)).toBe(icon.sizes);
    }
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true);
  });

  it('has the 180px apple touch icon and links everything from the page head', () => {
    expect(pngSize('public/apple-touch-icon.png')).toBe('180x180');
    const html = readFileSync('index.html', 'utf8');
    for (const needle of ['rel="apple-touch-icon"', 'rel="manifest"', 'favicon.svg', 'icon-192.png']) expect(html).toContain(needle);
  });
});

describe('content security policy', () => {
  const page = `<!doctype html><html><head><meta charset="UTF-8" />
    <script>window.a = 1;</script>
    <script src="/assets/app.js"></script>
    <script type="application/ld+json">{"a":1}</script>
    <script>
      window.b = 2;
    </script></head><body></body></html>`;

  it('hashes inline scripts only, not external scripts or JSON-LD data blocks', () => {
    const hashes = inlineScriptHashes(page);
    expect(hashes).toHaveLength(2);
    for (const h of hashes) expect(h).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/);
  });

  it('allows only the site itself and forbids plugins, framing of base URI and foreign form targets', () => {
    const csp = buildCsp({ hashes: inlineScriptHashes(page) });
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toMatch(/script-src 'self' 'sha256-/);
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).not.toContain('goatcounter');
  });

  it('gives the same hash for Windows (CRLF) and Unix (LF) line endings, as browsers do', () => {
    const crlf = page.replace(/\n/g, '\r\n');
    expect(crlf).not.toBe(page);
    expect(inlineScriptHashes(crlf)).toEqual(inlineScriptHashes(page));
  });

  it('allows data: only for fonts, because the build inlines very small font files', () => {
    const csp = buildCsp();
    expect(csp).toMatch(/font-src 'self' data:/);
    expect(csp).toMatch(/script-src 'self'(?! data:)/);
    expect(csp.match(/data:/g)).toHaveLength(2); // img-src and font-src only
  });

  it('adds the statistics service only when it is configured', () => {
    const csp = buildCsp({ analyticsCode: 'mysite' });
    expect(csp).toContain('https://gc.zgo.at');
    expect(csp).toContain('https://mysite.goatcounter.com');
  });

  it('is inserted right after the charset tag', () => {
    const out = withCsp(page, buildCsp());
    expect(out.indexOf('Content-Security-Policy')).toBeGreaterThan(out.indexOf('<meta charset'));
    expect(out.indexOf('Content-Security-Policy')).toBeLessThan(out.indexOf('<script'));
    expect(() => withCsp('<html><head></head></html>', 'x')).toThrow(/charset/);
  });
});

describe('certifications', () => {
  it('each shows its Credly badge, dates and verify link, and appears on Home before the results', () => {
    expect(profile.certifications.length).toBeGreaterThan(0);
    for (const c of profile.certifications) {
      expect(c.url, c.name).toMatch(/^https:\/\/www\.credly\.com\/badges\/[0-9a-f-]{36}$/);
      expect(c.image, c.name).toBeTruthy();
      expect(readFileSync(`public/${c.image}`).subarray(1, 4).toString('latin1'), `${c.image} is a PNG`).toBe('PNG');
      expect(c.issued && c.expires && c.issued < c.expires, `${c.name} dates`).toBe(true);
      expect(c.summary?.id, c.name).toBeTruthy();
    }
    const home = render('/').html;
    expect(home.indexOf('Credly badge:')).toBeGreaterThan(-1);
    expect(home.indexOf('Credly badge:')).toBeLessThan(home.indexOf('Results at a glance'));
    // the home page shows the short form (validity range on one line); the full dates are on About
    expect(home).toContain('Valid Oct 2026');
    expect(render('/id/').html).toContain('Berlaku Okt 2026');
    expect(render('/about/').html).toContain('Valid until');
    expect(render('/id/about/').html).toContain('Berlaku hingga');
  });
});

describe('visit statistics', () => {
  it('are on only when the build is configured for them', () => {
    // CI sets VITE_GOATCOUNTER_CODE once the owner adds the GitHub variable, so compare against the environment
    expect(analyticsEnabled).toBe(Boolean(import.meta.env.VITE_GOATCOUNTER_CODE));
  });
});

describe('translation review export', () => {
  it('lists every interface text and every area with both languages', () => {
    const rows = translationRows();
    expect(rows.filter((r) => r.area === 'Interface texts')).toHaveLength(Object.keys(en).length);
    for (const area of ['Profile and About', 'Resume variants', 'Experience', 'Case studies']) expect(rows.some((r) => r.area === area), area).toBe(true);
    for (const r of rows) {
      expect(r.en.trim(), `${r.area} / ${r.where}`).not.toBe('');
      expect(r.id.trim(), `${r.area} / ${r.where}`).not.toBe('');
    }
  });
});

describe('count-up numbers', () => {
  it('splits a value around its first number and leaves other text alone', () => {
    expect(splitNumber('about 86% faster')).toEqual({ before: 'about ', value: 86, after: '% faster' });
    expect(splitNumber('about 90% faster (hours to minutes)')?.value).toBe(90);
    expect(splitNumber('no digits here')).toBeNull();
  });

  it('keeps the final figures in the pre-rendered home page', () => {
    const html = render('/').html.replace(/<[^>]+>/g, '');
    expect(html).toContain('about 86% faster');
    expect(html).toContain('about 96% faster');
  });
});

describe('rotating role word under the hero headline', () => {
  const plain = (html: string) => html.replace(/<!-- -->/g, '').replace(/&amp;/g, '&');

  it('has the first role in the pre-rendered HTML and the full list as text for screen readers', () => {
    const roles = profile.alsoRoles;
    expect(roles.en.length).toBeGreaterThan(1);
    expect(roles.id.length).toBe(roles.en.length);
    const html = plain(render('/').html);
    expect(html).toContain(`<span>${roles.en[0]}</span>`);
    expect(html).toContain(`Also: ${roles.en.join(', ')}`);
    expect(plain(render('/id/').html)).toContain(`Juga: ${roles.id.join(', ')}`);
    // the animated part is hidden from assistive technology so it is not read letter by letter
    expect(html).toMatch(/aria-hidden="true"[^>]*class="inline-flex items-center gap-2"|class="inline-flex items-center gap-2"[^>]*aria-hidden="true"/);
  });

  it('is never wider than the room the hero gives it', () => {
    // the line reserves the width of the longest word; keep that within a phone's text width (about 30 monospace characters)
    for (const words of [profile.alsoRoles.en, profile.alsoRoles.id]) expect(Math.max(...words.map((w) => w.length))).toBeLessThanOrEqual(30);
  });
});

describe('home page flow (issue 7)', () => {
  const home = () => render('/').html;
  const at = (html: string, text: string) => {
    const i = html.indexOf(text);
    expect(i, `"${text}" is on the page`).toBeGreaterThan(-1);
    return i;
  };

  it('offers email, LinkedIn and GitHub links in the hero, and a contact call to action at the bottom', () => {
    const html = home();
    for (const href of [`mailto:${profile.email}`, profile.linkedin, profile.github]) expect(html).toContain(`href="${href.split('?')[0]}`);
    expect(at(html, 'aria-label="Contact links"')).toBeLessThan(at(html, 'id="cert-h"'));
    expect(at(html, "Let&#x27;s talk")).toBeGreaterThan(at(html, 'id="stack-h"'));
    expect(html).toContain('data-event="email-click"');
  });

  it('keeps the order: certifications, results, featured work, how I work, stack, contact', () => {
    const html = home();
    const ids = ['cert-h', 'proof-h', 'feat-h', 'how-h', 'stack-h', 'cta-h'].map((id) => at(html, `id="${id}"`));
    expect([...ids].sort((a, b) => a - b)).toEqual(ids);
  });

  it('has no live demo: no link anywhere (menu included) and no page', () => {
    for (const route of ['/', '/id/', '/about/', '/work/']) expect(render(route).html, route).not.toMatch(/href="(\/id)?\/demo/);
    expect(existsSync('src/pages/Demo.tsx')).toBe(false);
  });

  it('is complete in Indonesian too', () => {
    const html = render('/id/').html;
    expect(html).toContain('Mari berdiskusi');
    expect(html).toContain('Cara saya bekerja');
    expect(html).toContain('Peran:');
  });
});
