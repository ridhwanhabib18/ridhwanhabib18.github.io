// Renders Open Graph share cards to PNG with the browser that is already installed (Edge on Windows, Chrome elsewhere).
// Used by scripts/prerender.mjs during `npm run build`. Override the browser with PW_CHANNEL=chrome|msedge.
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { cardHtml, OG_HEIGHT, OG_WIDTH } from './og-cards-lib.mjs';

const fontPath = (pkg, file) => join(process.cwd(), 'node_modules', pkg, 'files', file);

/** items = [{ file: 'dist/og/home.png', card: {...} }] */
export async function generateOgImages(items) {
  const fonts = {
    inter: pathToFileURL(fontPath('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2')).href,
    mono: pathToFileURL(fontPath('@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')).href,
  };
  const photo = join(process.cwd(), 'public', 'profile.jpg');
  if (existsSync(photo)) fonts.photo = pathToFileURL(photo).href; // optional: cards show the profile photo when it exists
  const channel = process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : 'chrome');

  let browser;
  try {
    browser = await chromium.launch({ channel });
  } catch (e) {
    throw new Error(`og-images: could not start the "${channel}" browser (${e.message.split('\n')[0]}). Install Edge or Chrome, or set PW_CHANNEL.`);
  }

  // The card is loaded from a real file so that the local font files are allowed to load.
  const dir = mkdtempSync(join(tmpdir(), 'og-cards-'));
  const htmlFile = join(dir, 'card.html');
  try {
    const page = await browser.newPage({ viewport: { width: OG_WIDTH, height: OG_HEIGHT }, deviceScaleFactor: 1 });
    for (const { file, card } of items) {
      writeFileSync(htmlFile, cardHtml(card, fonts));
      await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      mkdirSync(dirname(file), { recursive: true });
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT } });
    }
  } finally {
    await browser.close();
    rmSync(dir, { recursive: true, force: true });
  }
}
