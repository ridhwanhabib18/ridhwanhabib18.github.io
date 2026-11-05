import { readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM helper without types
import { cardHtml, escapeHtml, OG_HEIGHT, OG_WIDTH } from '../../scripts/og-cards-lib.mjs';
import { projects, proofSlugs } from '../content/projects';
import { render, routes } from '../entry-server';
import { ogExtras } from '../og';
import { ogImageName, ogImageUrl } from '../lib/site';

const FONTS = { inter: 'file:///inter.woff2', mono: 'file:///mono.woff2' };

describe('share image names', () => {
  it('derives the file name from the page path', () => {
    expect(ogImageName('/')).toBe('home');
    expect(ogImageName('/id')).toBe('id');
    expect(ogImageName('/work/')).toBe('work');
    expect(ogImageName('/work/production-file-distribution/')).toBe('work-production-file-distribution');
    expect(ogImageName('/id/work/x')).toBe('id-work-x');
  });

  it('gives every pre-rendered page its own PNG under /og/', () => {
    const urls = routes.map((r) => render(r).head!.image);
    for (const u of urls) expect(u).toMatch(/^https:\/\/[^/]+\/og\/[a-z0-9-]+\.png$/);
    expect(new Set(urls).size).toBe(routes.length);
    expect(ogImageUrl('/')).toMatch(/\/og\/home\.png$/);
  });
});

describe('share card content', () => {
  it('shows labelled results on the home card, from the same data as the site', () => {
    const x = ogExtras('/');
    expect(x.kind).toBe('home');
    expect(x.metrics).toHaveLength(3);
    for (const m of x.metrics) expect(['Actual', 'Target']).toContain(m.badge);
    expect(x.title).toContain('Ridhwan');
    expect(proofSlugs.length).toBeGreaterThanOrEqual(3);
  });

  it('builds a case-study card with its own results and stack', () => {
    for (const p of projects) {
      const x = ogExtras(`/work/${p.slug}`);
      expect(x.kind, p.slug).toBe('case');
      expect(x.title).toBe(p.title.en);
      expect(x.metrics.length).toBe(Math.min(3, p.metrics.length));
      expect(x.chips).toEqual(p.stack.slice(0, 5));
    }
  });

  it('uses Indonesian text and labels on Indonesian pages', () => {
    const x = ogExtras('/id/work/production-planning-scheduling');
    expect(x.lang).toBe('id');
    expect(x.kicker).toBe('Diselesaikan');
    expect(x.metrics.map((m) => m.badge)).toContain('Target');
    expect(x.title).toBe('Sistem Perencanaan & Penjadwalan Produksi');
  });

  it('falls back to a plain page card for everything else', () => {
    expect(ogExtras('/experience').kind).toBe('page');
    expect(ogExtras('/id/resume').kind).toBe('page');
    expect(ogExtras('/work/does-not-exist').kind).toBe('page');
  });
});

describe('share card html', () => {
  const card = { kind: 'case', kicker: 'Delivered', title: 'A <b>bold</b> & "quoted" title', description: 'Text', metrics: [{ tone: 'actual', badge: 'Actual', value: 'about 90% faster', label: 'Recovery' }], chips: ['React'], name: 'Name', role: 'Role', domain: 'example.org' };

  it('escapes text so content can never inject markup', () => {
    const html = cardHtml(card, FONTS);
    expect(html).not.toContain('<b>bold</b>');
    expect(html).toContain('A &lt;b&gt;bold&lt;/b&gt; &amp; &quot;quoted&quot; title');
    expect(escapeHtml("'")).toBe('&#39;');
  });

  it('contains the labelled result, the stack and the footer, and fixes the size', () => {
    const html = cardHtml(card, FONTS);
    expect(html).toContain('badge actual');
    expect(html).toContain('about 90% faster');
    expect(html).toContain('React');
    expect(html).toContain('example.org');
    expect(html).toContain(`${OG_WIDTH}px`);
    expect(OG_WIDTH / OG_HEIGHT).toBeCloseTo(1200 / 630, 3);
    expect(html).not.toContain('undefined');
  });

  it('shows the profile photo only when one is provided', () => {
    expect(cardHtml(card, FONTS)).not.toContain('class="avatar"');
    expect(cardHtml(card, { ...FONTS, photo: 'file:///profile.jpg' })).toContain('class="avatar"');
    expect(cardHtml({ ...card, kind: 'home' }, { ...FONTS, photo: 'file:///profile.jpg' })).toContain('class="portrait"');
  });
});

describe('profile photo', () => {
  const file = 'public/profile.jpg';
  const bytes = readFileSync(file);

  /** Walk the JPEG segments: returns the marker codes before the image data and the frame size. */
  function inspect(b: Buffer) {
    const markers: number[] = [];
    let i = 2;
    let size = { width: 0, height: 0 };
    while (i < b.length - 4 && b[i] === 0xff) {
      const m = b[i + 1];
      if (m === 0xda) break;
      const len = b.readUInt16BE(i + 2);
      markers.push(m);
      if (m === 0xc0 || m === 0xc2) size = { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
    return { markers, size };
  }

  it('is a small square JPEG', () => {
    expect(bytes.subarray(0, 2).toString('hex')).toBe('ffd8');
    expect(statSync(file).size).toBeLessThan(100 * 1024);
    const { size } = inspect(bytes);
    expect(size.width).toBe(size.height);
    expect(size.width).toBeGreaterThanOrEqual(256);
  });

  it('has no EXIF, GPS or XMP metadata (privacy: it is published on a public site)', () => {
    const { markers } = inspect(bytes);
    expect(markers, 'APP1 (EXIF/XMP) segment present').not.toContain(0xe1);
    expect(bytes.includes(Buffer.from('Exif'))).toBe(false);
    expect(bytes.includes(Buffer.from('GPS'))).toBe(false);
  });
});
