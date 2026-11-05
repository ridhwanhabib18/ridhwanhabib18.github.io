// Pre-renders every route to static HTML for GitHub Pages, then writes 404.html, sitemap.xml and robots.txt.
// Run after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir dist-server`.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateOgImages } from './og-images.mjs';

const SITE = process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? 'https://ridhwanhabib18.github.io';
const BASE = (process.env.VITE_BASE ?? '/').replace(/\/$/, '');

const { render, routes, ogExtras } = await import(pathToFileURL(join(process.cwd(), 'dist-server/entry-server.js')).href);
const template = readFileSync('dist/index.html', 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headTags(h) {
  return [
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    `<link rel="alternate" hreflang="en" href="${esc(h.alternates.en)}" />`,
    `<link rel="alternate" hreflang="id" href="${esc(h.alternates.id)}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(h.canonical)}" />`,
    `<meta property="og:image" content="${esc(h.image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:alt" content="${esc(h.pageTitle ?? h.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${esc(h.image)}" />`,
  ].join('\n    ');
}

function inject(html, head, body) {
  let out = html;
  out = out.replace(/<html lang="[^"]*"/, `<html lang="${head.lang}"`);
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`);
  out = out.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(head.description)}" />`);
  out = out.replace('</head>', `    ${headTags(head)}\n  </head>`);
  const rootEmpty = '<div id="root"></div>';
  if (!out.includes(rootEmpty)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
  return out.replace(rootEmpty, `<div id="root">${body}</div>`);
}

const outFile = (route) => (route === '/' ? 'dist/index.html' : join('dist', route, 'index.html'));

// The empty shell is kept as the 404 page: the client router renders its own not-found view.
writeFileSync('dist/404.html', template);
writeFileSync('dist/.nojekyll', '');

const ogItems = [];
const domain = new URL(SITE).host;

for (const route of routes) {
  const { html, head } = render(route);
  if (!head) throw new Error(`prerender: ${route} did not provide head metadata (missing <Seo />)`);
  const file = outFile(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, inject(template, head, html));

  const x = ogExtras(route);
  ogItems.push({
    file: join('dist', 'og', basename(new URL(head.image).pathname)),
    card: {
      kind: x.kind,
      kicker: x.kicker,
      title: x.title ?? head.pageTitle ?? head.title,
      description: x.description ?? head.description,
      metrics: x.metrics,
      chips: x.chips,
      name: x.name,
      role: x.role,
      domain,
    },
  });
}

await generateOgImages(ogItems);

const url = (route) => `${SITE}${BASE}${route === '/' ? '/' : `${route}/`}`;
const pairs = routes.filter((r) => !r.startsWith('/id'));
const entries = pairs.flatMap((en) => {
  const id = en === '/' ? '/id' : `/id${en}`;
  const alt = `<xhtml:link rel="alternate" hreflang="en" href="${url(en)}"/><xhtml:link rel="alternate" hreflang="id" href="${url(id)}"/>`;
  return [`  <url><loc>${url(en)}</loc>${alt}</url>`, `  <url><loc>${url(id)}</loc>${alt}</url>`];
});

writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);
console.log(`prerender: ${routes.length} pages, ${ogItems.length} share images, 404.html, sitemap.xml (${entries.length} urls), robots.txt`);
