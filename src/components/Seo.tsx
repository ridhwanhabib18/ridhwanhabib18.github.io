import { useEffect } from 'react';
import { useI18n } from '../i18n';

const SITE = 'Ridhwan Habib';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Unique title, description and Open Graph tags per page, plus html lang. */
export function Seo({ title, description }: { title?: string; description: string }) {
  const { lang } = useI18n();
  useEffect(() => {
    const full = title ? `${title} | ${SITE}` : `${SITE} | Full Stack .NET Engineer`;
    document.title = full;
    document.documentElement.lang = lang;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
  }, [title, description, lang]);
  return null;
}
