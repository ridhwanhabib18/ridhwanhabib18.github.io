// Generates the favicon, the PNG app icons and a comparison picture from the site mark (scripts/brand-mark.mjs).
// Run `npm run icons` and commit public/*. Re-run only when the mark or the colours change.
// Uses the installed browser (Edge on Windows, Chrome elsewhere; override with PW_CHANNEL).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { iconSvg, markSvg } from './brand-mark.mjs';

const COLOR = '#26428b';

// "maskable" icons are cropped to a shape by the OS, so the mark must stay inside the central safe zone.
const ICONS = [
  { file: 'apple-touch-icon.png', size: 180, fraction: 0.72 },
  { file: 'icon-192.png', size: 192, fraction: 0.72 },
  { file: 'icon-512.png', size: 512, fraction: 0.72 },
  { file: 'icon-maskable-512.png', size: 512, fraction: 0.5 },
  { file: 'favicon-32.png', size: 32, fraction: 0.88 },
];

mkdirSync('public', { recursive: true });
mkdirSync('docs', { recursive: true });

// favicon.svg: rounded square, so it looks right in a browser tab
writeFileSync('public/favicon.svg', `${iconSvg({ size: 64, fraction: 0.88, background: COLOR, rounded: 0.2 })}\n`);
console.log('icons: public/favicon.svg');

const channel = process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : 'chrome');
const browser = await chromium.launch({ channel });
try {
  for (const { file, size, fraction } of ICONS) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><body style="margin:0;width:${size}px;height:${size}px">${iconSvg({ size, fraction, background: COLOR })}</body>`);
    await page.screenshot({ path: join('public', file), clip: { x: 0, y: 0, width: size, height: size } });
    await page.close();
    console.log(`icons: public/${file} (${size}x${size})`);
  }

  // comparison of <RH/> and <R/> at real sizes (not committed): docs/brand-preview.png
  const row = (text) => {
    const tile = (size, frac, r) => `<div style="text-align:center;color:#a3afc4;font:12px sans-serif">${iconSvg({ size, fraction: frac, background: COLOR, rounded: r, text })}<div>${size}px</div></div>`;
    const header = `<div style="display:flex;align-items:center;gap:8px;color:#8fb0ff;font:700 16px sans-serif;background:#0a0f1a;padding:10px 14px;border-radius:10px">${markSvg({ color: '#8fb0ff', size: 24, text })}<span style="color:#e8edf7">Ridhwan</span></div>`;
    return `<div style="display:flex;align-items:flex-end;gap:22px;margin:18px 0"><div style="width:70px;color:#e8edf7;font:700 20px monospace">&lt;${text}/&gt;</div>${tile(16, 0.9, 0.2)}${tile(32, 0.88, 0.2)}${tile(64, 0.88, 0.2)}${tile(128, 0.78, 0.2)}${tile(180, 0.72, 0)}${header}</div>`;
  };
  const page = await browser.newPage({ viewport: { width: 980, height: 560 }, deviceScaleFactor: 1 });
  await page.setContent(`<body style="margin:0;padding:18px 24px;background:#111827">${row('RH')}${row('R')}</body>`);
  await page.screenshot({ path: 'docs/brand-preview.png' });
  console.log('icons: docs/brand-preview.png (comparison of <RH/> and <R/>, not committed)');
} finally {
  await browser.close();
}
