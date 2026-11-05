import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { L10n, Lang } from '../content/types';
import { dictionaries } from './strings';

interface I18n {
  lang: Lang;
  t: (key: string) => string;
  /** Pick the active language from a bilingual value. */
  l: <T>(v: L10n<T>) => T;
  /** Build a path that keeps the active language prefix. */
  path: (to: string) => string;
  /** The same page in the other language. */
  switchPath: string;
  otherLang: Lang;
}

const Ctx = createContext<I18n | null>(null);

export const stripLang = (pathname: string): string => pathname.replace(/^\/id(?=\/|$)/, '') || '/';

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { pathname } = useLocation();
  const t = useCallback(
    (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
    [lang],
  );
  const value = useMemo<I18n>(() => {
    const prefix = lang === 'id' ? '/id' : '';
    const bare = stripLang(pathname);
    const otherLang: Lang = lang === 'en' ? 'id' : 'en';
    const switchPath = otherLang === 'id' ? `/id${bare === '/' ? '' : bare}` : bare;
    return {
      lang,
      t,
      l: (v) => v[lang] ?? v.en,
      path: (to) => (to === '/' ? prefix || '/' : `${prefix}${to}`),
      switchPath: switchPath || '/',
      otherLang,
    };
  }, [lang, t, pathname]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n must be used inside I18nProvider');
  return v;
}
