import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { absoluteUrl } from '@/lib/site';
import type { Lang } from '@/content/types';

const SITE_NAME = 'Ridhwan Habib';

export interface HeadData {
  title: string;
  description: string;
  lang: Lang;
  canonical: string;
  alternates: Record<Lang, string>;
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
export function Seo({ title, description }: { title?: string; description: string }) {
  const { lang, switchPath, otherLang } = useI18n();
  const { pathname } = useLocation();
  const collector = useContext(HeadCtx);

  const full = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Full Stack .NET Engineer`;
  const urls = { [lang]: absoluteUrl(pathname), [otherLang]: absoluteUrl(switchPath) } as Record<Lang, string>;

  if (collector) collector.data = { title: full, description, lang, canonical: urls[lang], alternates: urls };

  useEffect(() => {
    document.title = full;
    document.documentElement.lang = lang;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', urls[lang]);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setLink('link[rel="canonical"]', { rel: 'canonical', href: urls[lang] });
    (['en', 'id'] as Lang[]).forEach((l) => setLink(`link[rel="alternate"][hreflang="${l}"]`, { rel: 'alternate', hreflang: l, href: urls[l] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full, description, lang, urls.en, urls.id]);

  return null;
}
