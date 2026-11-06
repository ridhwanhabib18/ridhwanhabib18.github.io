import { expect, test } from '@playwright/test';

/**
 * Checks on the built site: every page points at a real 1200x630 PNG share image, and the profile photo loads.
 * Run `npm run build` first, then `npm run test:e2e`.
 */

async function sitemapPaths(request: import('@playwright/test').APIRequestContext): Promise<string[]> {
  const xml = await (await request.get('/sitemap.xml')).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

test('every page has an og:image that exists and is a 1200x630 PNG', async ({ request }) => {
  const paths = await sitemapPaths(request);
  expect(paths.length).toBeGreaterThanOrEqual(20); // every page in both languages; a sanity floor, not an exact count

  const seen = new Set<string>();
  for (const path of paths) {
    const html = await (await request.get(path)).text();
    const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    expect(image, `${path} has no og:image`).toBeTruthy();
    expect(html, `${path} should ask for a large card`).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('property="og:image:width" content="1200"');

    const imagePath = new URL(image!).pathname; // the absolute URL points at the live domain; read the local copy
    expect(seen.has(imagePath), `${path} shares an image with another page`).toBe(false);
    seen.add(imagePath);

    const res = await request.get(imagePath);
    expect(res.status(), `${imagePath} should exist`).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
    const buf = await res.body();
    expect(buf.subarray(1, 4).toString('latin1'), `${imagePath} should be a PNG`).toBe('PNG');
    expect(buf.readUInt32BE(16), `${imagePath} width`).toBe(1200);
    expect(buf.readUInt32BE(20), `${imagePath} height`).toBe(630);
  }
});

test('the profile photo loads on the home and about pages', async ({ page }) => {
  for (const route of ['/', '/about/', '/id/about/']) {
    await page.goto(route);
    const photo = page.getByRole('img', { name: 'Muhammad Ridhwan Habib Abdillah' }).first();
    await expect(photo).toBeVisible();
    expect(await photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), `${route} photo loaded`).toBe(true);
  }
});
