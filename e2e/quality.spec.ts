import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Quality checks on the built site: WCAG 2.2 AA (automated part, via axe), Content Security Policy, structured data,
 * icons, the resume and copy-email buttons, and the print layout. Run `npm run build` first.
 */

const ROUTES = [
  '/',
  '/work/',
  '/work/production-file-distribution/',
  '/work/production-planning-scheduling/',
  '/work/paperless-invoice-approval/',
  '/work/part-approval-certification/',
  '/experience/',
  '/demo/',
  '/about/',
  '/resume/',
  '/contact/',
  '/id/',
  '/id/work/',
  '/id/work/production-file-distribution/',
  '/id/experience/',
  '/id/demo/',
  '/id/about/',
  '/id/resume/',
  '/id/contact/',
];

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  // run the scroll-driven reveals and let every animation finish, so contrast is measured on the final colours
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

for (const theme of ['dark', 'light'] as const) {
  test.describe(`WCAG 2.2 AA with axe, ${theme} theme`, () => {
    test.describe.configure({ timeout: 60_000 }); // axe on a busy machine can need more than the default 30 s
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    });

    for (const route of ROUTES) {
      test(`${route} has no violations`, async ({ page }) => {
        await page.goto(route);
        await settle(page);
        const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        const report = violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n   ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n   ')}`);
        expect(report, `accessibility violations on ${route} (${theme})`).toEqual([]);
      });
    }
  });
}

test('the Content Security Policy blocks nothing the site needs', async ({ page }) => {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (/Content Security Policy|Refused to (load|execute|apply|connect)/i.test(m.text())) problems.push(m.text().slice(0, 160));
  });
  page.on('pageerror', (e) => problems.push(`page error: ${e.message.slice(0, 160)}`));

  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
  }

  // the interactive demo uses a Web Worker and IndexedDB: exercise both
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Connect' }).click();
  await expect(page.getByText('Connected (simulated)')).toBeVisible();
  await page.getByLabel('Request title').fill('Update line 3 program');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Update line 3 program')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle theme' }).click();

  expect(problems).toEqual([]);
});

test('every page ships the policy as its first meta tag after the charset', async ({ request }) => {
  for (const path of ['/', '/work/production-file-distribution/', '/id/contact/', '/404.html']) {
    const html = await (await request.get(path)).text();
    const csp = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
    expect(csp, `${path} has no policy`).toBeTruthy();
    expect(csp).toContain("object-src 'none'");
    expect(html.indexOf('Content-Security-Policy')).toBeLessThan(html.indexOf('<script'));
  }
});

test('structured data is valid JSON in the built pages', async ({ request }) => {
  for (const [path, type] of [['/', 'Person'], ['/about/', 'Person'], ['/work/production-file-distribution/', 'BreadcrumbList']] as const) {
    const html = await (await request.get(path)).text();
    const raw = html.match(/<script id="ld-json" type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
    expect(raw, `${path} has no JSON-LD`).toBeTruthy();
    const graph = JSON.parse(raw!)['@graph'] as { '@type': string }[];
    expect(graph.map((n) => n['@type'])).toContain(type);
  }
});

test('icons, manifest and head links are served', async ({ request, page }) => {
  for (const file of ['apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) {
    const res = await request.get(`/${file}`);
    expect(res.status(), file).toBe(200);
    expect((await res.body()).subarray(1, 4).toString('latin1')).toBe('PNG');
  }
  const manifest = await (await request.get('/site.webmanifest')).json();
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(2);
});

test('the home page and the footer offer a one-click resume download', async ({ page }) => {
  await page.goto('/');
  const hero = page.getByRole('link', { name: 'Download resume (PDF)' });
  await expect(hero).toBeVisible();
  expect(await hero.getAttribute('href')).toMatch(/resume\/ridhwan-habib-resume-senior\.pdf$/);
  expect(await hero.getAttribute('download')).not.toBeNull();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Resume (PDF)' })).toBeVisible();

  await page.goto('/id/');
  await expect(page.getByRole('link', { name: 'Unduh resume (PDF)' })).toBeVisible();
});

test('the contact page copies the email address with one click', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('eng.ridhwan18@gmail.com');
  await expect(page.getByRole('status').filter({ hasText: 'Copied!' })).toHaveCount(1); // announced to screen readers
});

test('printing hides the navigation, uses a white page and shows every role', async ({ page }) => {
  await page.goto('/experience/');
  await page.waitForLoadState('networkidle');
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('banner')).toBeHidden();
  await expect(page.getByRole('contentinfo')).toBeHidden();
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
  // the second role is collapsed on screen; in print it must be readable
  await expect(page.getByText('RS-232 and RS-485 communication modules')).toBeVisible();
});

test('Experience keeps every role in the HTML for search engines, even collapsed ones', async ({ request }) => {
  const html = await (await request.get('/experience/')).text();
  expect(html).toContain('RS-232 and RS-485 communication modules');
});

test.describe('the headline results count up', () => {
  const first = (page: Page) => page.locator('section', { has: page.locator('#proof-h') }).locator('strong').first();

  test('start low when scrolled into view and end on the final figure, without moving the layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const box = first(page);
    await box.scrollIntoViewIfNeeded();
    const before = await box.boundingBox();
    await expect(box).toHaveText('about 86% faster', { timeout: 4000 });
    const after = await box.boundingBox();
    expect(after!.height).toBe(before!.height);
    expect(after!.width).toBe(before!.width);
  });

  test('show the final figures at once when the visitor prefers reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(first(page)).toHaveText('about 86% faster');
  });
});

test.describe('the Experience timeline', () => {
  const animationOf = (page: Page, selector: string, pseudo?: string) =>
    page.evaluate(([sel, ps]) => getComputedStyle(document.querySelector(sel as string)!, (ps as string) || null).animationName, [selector, pseudo ?? '']);

  test('grows a progress line and lights up the dots while scrolling', async ({ page }) => {
    await page.goto('/experience/');
    await page.waitForLoadState('networkidle');
    expect(await animationOf(page, 'ol.timeline-progress', '::after')).toBe('timeline-grow');
    expect(await animationOf(page, '.timeline-dot')).toBe('timeline-dot-on');
  });

  test('stays plain for visitors who prefer reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/experience/');
    expect(await animationOf(page, 'ol.timeline-progress', '::after')).toBe('none');
    expect(await animationOf(page, '.timeline-dot')).toBe('none');
  });
});

test.describe('the architecture diagram is drawn as it scrolls into view', () => {
  const page_ = '/work/production-file-distribution/';
  const info = (page: Page) =>
    page.evaluate(() => {
      const line = document.querySelector('.diagram-edge line')!;
      const node = document.querySelector('.diagram-node')!;
      return { line: getComputedStyle(line).animationName, node: getComputedStyle(node).animationName, edges: document.querySelectorAll('.diagram-edge').length };
    });

  test('connections draw one after another and finish fully drawn', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(page_);
    await page.waitForLoadState('networkidle');
    const before = await info(page);
    expect(before.line).toBe('diagram-draw');
    expect(before.node).toBe('diagram-fade');
    expect(before.edges).toBeGreaterThan(2);
    // scroll until the whole figure is on screen: every line must be completely drawn
    await page.locator('figure.diagram-figure').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);
    const offsets = await page.evaluate(() => [...document.querySelectorAll('.diagram-edge line')].map((l) => getComputedStyle(l).strokeDashoffset));
    expect(offsets.every((o) => parseFloat(o) === 0), offsets.join(',')).toBe(true);
  });

  test('stays a finished picture with reduced motion and in print', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(page_);
    expect((await info(page)).line).toBe('none');
    await page.emulateMedia({ reducedMotion: 'no-preference', media: 'print' });
    expect((await info(page)).line).toBe('none');
  });
});
