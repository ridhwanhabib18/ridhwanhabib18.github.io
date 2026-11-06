import { expect, test, type Page } from '@playwright/test';

/**
 * Layout checks in a real browser at phone widths (and a desktop check for the diagram).
 * Run `npm run build` first, then `npm run test:e2e`.
 */

const ROUTES = [
  '/',
  '/work/',
  '/work/production-file-distribution/',
  '/work/production-planning-scheduling/',
  '/work/paperless-invoice-approval/',
  '/experience/',
  '/about/',
  '/resume/',
  '/contact/',
  '/id/',
  '/id/work/',
  '/id/experience/',
  '/id/resume/',
];

/** Scroll the whole page so scroll-reveal content is shown and measured. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

/** Things that stick out of the viewport or are clipped, excluding intentional scroll areas and screen-reader-only text. */
async function layoutProblems(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const out: string[] = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > vw) out.push(`page is ${doc.scrollWidth - vw}px wider than the screen`);

    const inScrollArea = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'auto' || o === 'scroll') return true;
      }
      return false;
    };
    const label = (el: Element) => `<${el.tagName.toLowerCase()}> "${(el.textContent ?? '').trim().slice(0, 50)}"`;

    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) continue; // screen-reader-only and hidden elements
      if (r.right > vw + 1 && !inScrollArea(el)) out.push(`sticks out to the right (${Math.round(r.right)} > ${vw}): ${label(el)}`);
      const cs = getComputedStyle(el);
      if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && el.scrollWidth > el.clientWidth + 1) out.push(`clips its content (${el.scrollWidth} > ${el.clientWidth}): ${label(el)}`);
    }
    return out.slice(0, 6);
  });
}

for (const width of [360, 390]) {
  test.describe(`phone ${width}px`, () => {
    test.use({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true });

    for (const route of ROUTES) {
      test(`${route} has no overflow or clipped content`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await scrollThrough(page);
        expect(await layoutProblems(page)).toEqual([]);
      });
    }

    test('the Resume tabs stay inside their container', async ({ page }) => {
      await page.goto('/resume/');
      const list = page.getByRole('tablist');
      const box = (await list.boundingBox())!;
      for (const tab of await page.getByRole('tab').all()) {
        const t = (await tab.boundingBox())!;
        expect(t.x, 'tab starts inside the list').toBeGreaterThanOrEqual(box.x - 1);
        expect(t.x + t.width, 'tab ends inside the list').toBeLessThanOrEqual(box.x + box.width + 1);
        expect(t.y + t.height, 'tab bottom is inside the list').toBeLessThanOrEqual(box.y + box.height + 1);
      }
    });

    test('the menu opens, navigates and closes', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Menu' }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('link', { name: 'Experience' }).click();
      await expect(page).toHaveURL(/\/experience\/?$/);
      await expect(dialog).toBeHidden();
    });

    test('header buttons are big enough to tap', async ({ page }) => {
      await page.goto('/');
      for (const name of ['Toggle theme', 'Menu']) {
        const b = (await page.getByRole('button', { name }).boundingBox())!;
        expect(Math.min(b.width, b.height), name).toBeGreaterThanOrEqual(40);
      }
      const lang = (await page.getByRole('link', { name: /Switch language/ }).boundingBox())!;
      expect(Math.min(lang.width, lang.height), 'language switch').toBeGreaterThanOrEqual(40);
    });

    test('the architecture diagram is a readable list, not a sideways-scrolling picture', async ({ page }) => {
      await page.goto('/work/production-file-distribution/');
      const list = page.getByRole('list', { name: /Architecture/ });
      await expect(list).toBeVisible();
      await expect(list.getByText('ASP.NET Core API').first()).toBeVisible();
      await expect(page.locator('figure svg')).toBeHidden();
    });
  });
}

test.describe('desktop 1280px', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('the architecture diagram is drawn as a picture', async ({ page }) => {
    await page.goto('/work/production-file-distribution/');
    await expect(page.locator('figure svg')).toBeVisible();
    // The connection list is kept for screen readers but must not take up space on a big screen.
    const wrapper = page.getByRole('list', { name: /Architecture/ }).locator('xpath=..');
    const box = (await wrapper.boundingBox())!;
    expect(Math.max(box.width, box.height)).toBeLessThanOrEqual(1);
  });

  test('no overflow on the main pages', async ({ page }) => {
    for (const route of ['/', '/work/', '/experience/', '/resume/']) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await scrollThrough(page);
      expect(await layoutProblems(page), route).toEqual([]);
    }
  });
});
