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
  '/work/schomans/',
  '/work/coffee-roasto/',
  '/work/production-planning-scheduling/',
  '/work/paperless-invoice-approval/',
  '/work/part-approval-certification/',
  '/experience/',
  '/about/',
  '/resume/',
  '/contact/',
  '/id/',
  '/id/work/',
  '/id/work/production-file-distribution/',
  '/id/work/schomans/',
  '/id/work/coffee-roasto/',
  '/id/experience/',
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

test.describe('cards lift on hover and the certification badge glints once', () => {
  const state = (page: Page, selector: string) =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel)!;
      const cs = getComputedStyle(el);
      return { transform: cs.transform, shadow: cs.boxShadow, glint: getComputedStyle(el.querySelector('.cert-badge') ?? el, '::after').animationName };
    }, selector);

  test('a certification card lifts and its badge glints when hovered', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const card = page.locator('.lift', { has: page.locator('.cert-badge') }).first();
    await card.scrollIntoViewIfNeeded();
    const still = await state(page, '.lift:has(.cert-badge)');
    expect(still.transform).toBe('none');
    await card.hover();
    await page.waitForTimeout(500);
    const hovered = await state(page, '.lift:has(.cert-badge)');
    expect(hovered.transform).not.toBe('none');
    expect(hovered.shadow).not.toBe(still.shadow);
    expect(hovered.glint).toBe('badge-glint');
  });

  test('a project card lifts when hovered', async ({ page }) => {
    await page.goto('/work/');
    await page.waitForLoadState('networkidle');
    const card = page.locator('.lift').first();
    await card.hover();
    await page.waitForTimeout(500);
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none');
  });

  test('cards stay still for visitors who prefer reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const card = page.locator('.lift', { has: page.locator('.cert-badge') }).first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.waitForTimeout(500);
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  });
});

test.describe('page transitions', () => {
  const countTransitions = `
    window.__vt = 0;
    if (document.startViewTransition) {
      const original = document.startViewTransition.bind(document);
      document.startViewTransition = (cb) => { window.__vt++; return original(cb); };
    }`;

  test('navigating with a link uses a view transition, lands on the new page and scrolls to the top', async ({ page }) => {
    await page.addInitScript(countTransitions);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.getByRole('banner').getByRole('link', { name: 'Projects', exact: true }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(1);
  });

  test('a modified click (new tab) is left to the browser', async ({ page, context }) => {
    await page.addInitScript(countTransitions);
    await page.goto('/');
    const [popup] = await Promise.all([context.waitForEvent('page'), page.getByRole('banner').getByRole('link', { name: 'Projects', exact: true }).click({ modifiers: ['Control'] })]);
    await popup.waitForLoadState();
    expect(popup.url()).toMatch(/\/work\/?$/);
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(0);
  });

  test('no transition is started for visitors who prefer reduced motion, and navigation still works', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(countTransitions);
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(0);
  });

  test('browsers without the API navigate as before', async ({ page }) => {
    await page.addInitScript('delete Document.prototype.startViewTransition;');
    await page.goto('/');
    expect(await page.evaluate(() => 'startViewTransition' in document)).toBe(false);
    await page.getByRole('banner').getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
  });
});

test.describe('the rotating role word under the hero headline', () => {
  const word = (page: Page) => page.locator('span[aria-hidden="true"] > span.inline-flex > span').first();

  test('starts on the first role, then types other roles without moving anything', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready); // the width is measured in the monospace font, so wait until it has arrived
    const first = (await word(page).textContent()) ?? '';
    expect(first).not.toBe('');
    // the headline above it is plain static text, with no animation of its own
    const headline = page.locator('h1 + p');
    expect(await headline.evaluate((el) => getComputedStyle(el.querySelector('span') ?? el).animationName)).not.toMatch(/type/);
    const holder = page.locator('span[aria-hidden="true"] > span.inline-flex').first();
    const size = async () => holder.evaluate((el) => { const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; });
    const before = await size();
    const seen = new Set<string>();
    await expect.poll(async () => { seen.add((await word(page).textContent()) ?? ''); return [...seen].some((w) => w !== first && w !== ''); }, { timeout: 15000, intervals: [150] }).toBe(true);
    expect(await size()).toEqual(before);
  });

  test('stays on the first role for visitors who prefer reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const first = (await word(page).textContent()) ?? '';
    await page.waitForTimeout(6500);
    await expect(word(page)).toHaveText(first);
    await expect(page.locator('.typed-caret')).toBeHidden();
  });

  test('tells screen readers all the roles once, as plain text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.sr-only', { hasText: /^Also: / })).toHaveCount(1);
  });
});

test('the largest contentful paint stays the hero heading, even for a visitor who does nothing while the roles rotate', async ({ page }) => {
  // The rotating role word changes its text a few seconds after load. A text change is a new paint, so if no larger element
  // were already the LCP candidate, the late change would become the LCP (4 to 5 s). The heading must not fade in from
  // opacity 0 (elements that start invisible are not counted), so that it is the large early candidate.
  await page.addInitScript(() => {
    (window as unknown as { __lcp: { t: number; tag: string }[] }).__lcp = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) (window as unknown as { __lcp: { t: number; tag: string }[] }).__lcp.push({ t: Math.round(e.startTime), tag: (e as unknown as { element?: Element }).element?.tagName ?? '?' });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto('/');
  await page.waitForTimeout(7000); // long enough for the first word change, with no scroll or click
  const entries = await page.evaluate(() => (window as unknown as { __lcp: { t: number; tag: string }[] }).__lcp);
  expect(entries.length).toBeGreaterThan(0);
  const last = entries[entries.length - 1];
  expect(last.tag, JSON.stringify(entries)).toBe('H1');
  expect(last.t, JSON.stringify(entries)).toBeLessThan(3000);
});

test.describe('the Projects page', () => {
  test('shows professional work and personal projects, and the scope buttons filter them', async ({ page }) => {
    await page.goto('/work/');
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Professional' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Personal projects' })).toBeVisible();

    await page.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'Personal' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Professional' })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 3, name: /SchoMans/ })).toBeVisible();

    await page.getByRole('group', { name: 'Show' }).getByRole('button', { name: 'Professional' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Personal projects' })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 3, name: 'Delivered end to end' })).toBeVisible();
  });

  test('the SchoMans page links out safely to the public repository and lists the stack by layer', async ({ page }) => {
    await page.goto('/work/schomans/');
    const repo = page.getByRole('link', { name: /Source code on GitHub/ });
    await expect(repo).toHaveAttribute('href', 'https://github.com/ridhwanhabib18/schomans');
    await expect(repo).toHaveAttribute('target', '_blank');
    expect(await repo.getAttribute('rel')).toContain('noopener');
    await expect(page.getByRole('heading', { level: 3, name: 'Testing' })).toBeVisible();
  });

  test('the menu says Projects in both languages and no longer has a demo', async ({ page }) => {
    await page.goto('/id/');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Proyek', exact: true })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: /demo/i })).toHaveCount(0);
  });
});

test.describe('a personal project has its own page', () => {
  test('the card opens it; it shows the state, architecture, design and pictures that load', async ({ page }) => {
    await page.goto('/work/');
    await expect(page.getByRole('link', { name: 'SchoMans: School Management System' })).toBeVisible();
    await expect(page.locator('li, div', { hasText: 'Personal' }).getByText('Done').first()).toBeVisible();
    await page.getByRole('link', { name: 'SchoMans: School Management System' }).click();
    await expect(page).toHaveURL(/\/work\/schomans\/?$/);
    await expect(page.getByRole('heading', { level: 1, name: /SchoMans/ })).toBeVisible();
    await expect(page.getByText('Done', { exact: true }).first()).toBeVisible();
    for (const h of ['Overview', 'Features', 'System architecture', 'System design', 'Key decisions (ADRs)', 'Tech stack', 'Build phases', 'Documentation', 'Getting started', 'Screenshots and flows']) {
      await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
    }
    // the architecture is drawn as pictures on a wide screen
    await expect(page.getByRole('img', { name: 'Containers and deployment' })).toBeVisible();

    // pictures load (they are lazy, so scroll to them)
    for (const alt of [/QR attendance: the teacher shows the code/, /Teacher: grade book/]) {
      const img = page.getByRole('img', { name: alt });
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    // external links are safe, and the way back works
    const repo = page.getByRole('link', { name: /Source code on GitHub/ });
    expect(await repo.getAttribute('rel')).toContain('noopener');
    await page.getByRole('link', { name: 'Back to projects' }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
  });

  test('the Indonesian page says Selesai and keeps the same sections', async ({ page }) => {
    await page.goto('/id/work/schomans/');
    await expect(page.getByText('Selesai', { exact: true }).first()).toBeVisible();
    for (const h of ['Ringkasan', 'Arsitektur sistem', 'Desain sistem', 'Keputusan penting (ADR)', 'Fase pengerjaan']) {
      await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
    }
  });
});

test('the Coffee Roasto page shows its sections and pictures, and leaves out what a private repository cannot back', async ({ page }) => {
  await page.goto('/work/coffee-roasto/');
  await expect(page.getByRole('heading', { level: 1, name: /Coffee Roasto/ })).toBeVisible();
  for (const h of ['Overview', 'Features', 'System architecture', 'System design', 'Key decisions (ADRs)', 'Tech stack', 'Getting started']) {
    await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 2, name: 'Build phases' })).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 2, name: 'Documentation' })).toHaveCount(0);
  await expect(page.locator('a[href*="github.com/ridhwanhabib18/capstone"]')).toHaveCount(0);
  const shot = page.getByRole('img', { name: /dark theme/ });
  await shot.scrollIntoViewIfNeeded();
  await expect.poll(() => shot.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await page.goto('/work/');
  await expect(page.getByRole('link', { name: /Coffee Roasto/ }).first()).toBeVisible();
});

test('the education card on About opens the thesis in the university repository, in a new tab', async ({ page }) => {
  await page.goto('/about/');
  const link = page.getByRole('link', { name: 'Read my undergraduate thesis' });
  await expect(link).toHaveAttribute('href', 'https://etd.repository.ugm.ac.id/home/detail_pencarian/217482');
  await expect(link).toHaveAttribute('target', '_blank');
  expect(await link.getAttribute('rel')).toContain('noopener');
  // like the certification cards, only the link text opens it: the rest of the card is not a link
  const card = page.locator('[data-slot="card"]', { has: link });
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  const hit = await page.evaluate(([x, y]) => (document.elementFromPoint(x, y) as HTMLElement | null)?.closest('a')?.getAttribute('href') ?? null, [box.x + 12, box.y + 12]);
  expect(hit, 'the card corner is not part of the link').toBeNull();
  await page.goto('/experience/');
  await expect(page.getByRole('link', { name: 'Read my undergraduate thesis' })).toHaveCount(0);
});

test('the university emblem loads next to the education entry on About and Experience', async ({ page }) => {
  for (const route of ['/about/', '/experience/']) {
    await page.goto(route);
    const img = page.locator('img[src*="ugm-emblem"]');
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), { message: `${route} emblem` }).toBe(true);
    expect(await img.getAttribute('alt')).toBe('');
    // Experience keeps the entry compact (one short block); About shows it as a card like the certifications
    const entry = page.locator('h3', { hasText: 'Universitas Gadjah Mada' }).locator(route === '/about/' ? 'xpath=ancestor::*[@data-slot="card"][1]' : 'xpath=ancestor::div[contains(@class,"items-center")][1]');
    const height = (await entry.boundingBox())!.height;
    if (route === '/experience/') expect(height).toBeLessThan(90);
    else await expect(entry).toHaveClass(/lift/);
  }
});
