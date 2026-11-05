import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { absoluteUrl, ogImageUrl } from '@/lib/site';
import type { Lang } from '@/content/types';

const SITE_NAME = 'Ridhwan Habib';

export interface HeadData {
  title: string;
  /** The page's own title without the site name, when it has one. */
  pageTitle?: string;
  /** Absolute URL of the Open Graph image for this page. */
  image: string;
  description: string;
  lang: Lang;
  canonical: string;
  alternates: Record<Lang, string>;
  /** schema.org JSON-LD as a ready-to-embed string (already escaped), when the page has structured data. */
  jsonLd?: string;
}

/** During pre-rendering the server entry provides a collector here; on the client it is null. */
export const HeadCtx = createContext<{ data?: HeadData } | null>(null);

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

/** Unique title, description, canonical and hreflang per page. Pre-rendered at build time, kept in sync on navigation. */
export function Seo({ title, description, jsonLd }: { title?: string; description: string; jsonLd?: object }) {
  const { lang, switchPath, otherLang } = useI18n();
  const { pathname } = useLocation();
  const collector = useContext(HeadCtx);

  const full = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Full Stack .NET Engineer`;
  const urls = { [lang]: absoluteUrl(pathname), [otherLang]: absoluteUrl(switchPath) } as Record<Lang, string>;

  const image = ogImageUrl(pathname);

  const ld = jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '';

  if (collector) collector.data = { title: full, pageTitle: title, image, description, lang, canonical: urls[lang], alternates: urls, jsonLd: ld || undefined };

  useEffect(() => {
    // Structured data: replace (or remove) the block of the page we navigated away from.
    const existing = document.getElementById('ld-json');
    if (ld) {
      const el = existing ?? Object.assign(document.createElement('script'), { id: 'ld-json', type: 'application/ld+json' });
      el.textContent = ld;
      if (!existing) document.head.appendChild(el);
    } else existing?.remove();
    document.title = full;
    document.documentElement.lang = lang;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', urls[lang]);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title ?? full);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setLink('link[rel="canonical"]', { rel: 'canonical', href: urls[lang] });
    (['en', 'id'] as Lang[]).forEach((l) => setLink(`link[rel="alternate"][hreflang="${l}"]`, { rel: 'alternate', hreflang: l, href: urls[l] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, description, lang, urls.en, urls.id, image, ld]);

  return null;
}
