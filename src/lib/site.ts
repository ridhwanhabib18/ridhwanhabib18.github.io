/** Public origin used for canonical and hreflang URLs. Override with VITE_SITE_URL. */
export const SITE: string = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://ridhwanhabib18.github.io';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Absolute URL for a router path. Pre-rendered pages are directories, so non-root paths end with "/". */
export function absoluteUrl(path: string): string {
  const clean = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  return `${SITE}${base}${clean}`;
}

/** File name (no extension) of the Open Graph image for a router path: "/" -> "home", "/id/work/x/" -> "id-work-x". */
export function ogImageName(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean === '' ? 'home' : clean.replace(/\//g, '-');
}

/** Absolute URL of the Open Graph image for a router path. The images are generated at build time into dist/og/. */
export const ogImageUrl = (path: string): string => `${SITE}${base}/og/${ogImageName(path)}.png`;
