// GitHub Pages helpers: SPA fallback, .nojekyll, sitemap and robots.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = process.env.SITE_URL ?? 'https://ridhwanhabib18.github.io';
const BASE = (process.env.VITE_BASE ?? '/').replace(/\/$/, '');

copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');

const projectsSrc = readFileSync('src/content/projects.ts', 'utf8');
const slugs = [...projectsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const pages = ['', '/work', '/experience', '/demo', '/about', '/resume', '/contact', ...slugs.map((s) => `/work/${s}`)];

const urls = pages.flatMap((p) => {
  const en = `${SITE}${BASE}${p || '/'}`;
  const id = `${SITE}${BASE}/id${p}`;
  return [
    `  <url><loc>${en}</loc><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="id" href="${id}"/></url>`,
    `  <url><loc>${id}</loc><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="id" href="${id}"/></url>`,
  ];
});

writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);
console.log(`postbuild: 404.html, sitemap.xml (${urls.length} urls), robots.txt`);
