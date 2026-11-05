import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { iconSvg, markGeometry, MARK } from '../../scripts/brand-mark.mjs';
import { render } from '../entry-server';

describe('site mark (<RH/>)', () => {
  it('is drawn from strokes in a fixed 32-unit-high box, for both variants', () => {
    const rh = markGeometry('RH');
    const r = markGeometry('R');
    expect([rh.width, rh.height]).toEqual([64, 32]);
    expect([r.width, r.height]).toEqual([49, 32]);
    // < + R (stem, leg) + H (two stems, bar) + / + >  versus  < + R (stem, leg) + / + >
    expect(rh.d.match(/M/g)).toHaveLength(8);
    expect(r.d.match(/M/g)).toHaveLength(5);
    expect(rh.d).not.toMatch(/NaN|undefined/);
  });

  it('keeps every stroke inside the box so nothing is clipped', () => {
    for (const text of ['RH', 'R']) {
      const g = markGeometry(text);
      // arc commands carry radii and flags before their end point; only the coordinates matter here
      const withoutArcParams = g.d.replace(/A\d+ \d+ \d \d \d /g, '');
      const nums = [...withoutArcParams.matchAll(/-?\d+(\.\d+)?/g)].map((m) => Number(m[0]));
      expect(Math.min(...nums)).toBeGreaterThanOrEqual(1.6); // half the stroke width
      expect(Math.max(...nums)).toBeLessThanOrEqual(g.width - 1.6);
    }
  });

  it('places the mark centred inside app icons', () => {
    const svg = iconSvg({ size: 180, fraction: 0.72 });
    expect(svg).toContain('<rect width="180" height="180"');
    const x = Number(svg.match(/<svg x="([\d.]+)"/)![1]);
    expect(x).toBeCloseTo((180 - 180 * 0.72) / 2, 2);
  });

  it('is the same shape in the header, the favicon and the share-card fallback', () => {
    const d = markGeometry().d;
    expect(MARK).toMatch(/^(RH|R)$/);
    expect(render('/').html).toContain(`d="${d}"`); // header, pre-rendered
    expect(readFileSync('public/favicon.svg', 'utf8')).toContain(`d="${d}"`); // run `npm run icons` after changing MARK
  });
});
