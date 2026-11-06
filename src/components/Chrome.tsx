import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Link, NavLink } from '@/components/TransitionLink';
import { Menu, Moon, Sun } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { container } from '@/lib/ui';
import { analyticsEnabled, trackPage } from '@/lib/analytics';
import { primaryResumeKey, resumeHref } from '@/content/resume';

function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* storage may be unavailable; the choice then lasts for this visit only */
    }
    setDark(next);
  };
  return (
    <Button type="button" variant="outline" size="icon" className="size-10 sm:size-9" onClick={toggle} aria-label={t('theme.toggle')} title={t('theme.toggle')}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

function LangToggle() {
  const { t, switchPath, otherLang } = useI18n();
  return (
    <Button asChild variant="outline" size="icon" className="size-10 text-xs font-bold sm:size-9">
      <Link to={switchPath} hrefLang={otherLang} lang={otherLang} aria-label={`${otherLang.toUpperCase()}: ${t('lang.switchLabel')}`} title={t('lang.switchLabel')}>
        {otherLang.toUpperCase()}
      </Link>
    </Button>
  );
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn('relative py-1 text-sm transition-colors hover:text-foreground', isActive ? 'font-medium text-foreground' : 'text-muted-foreground');

export function Layout() {
  const { t, path, lang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // a new page starts at the top at once; smooth scrolling (html:focus-within in globals.css) would leave the page
    // transition capturing the old scroll position
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    trackPage(pathname);
  }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const links: [string, string][] = [
    ['/work', t('nav.work')],
    ['/experience', t('nav.experience')],
    ['/about', t('nav.about')],
    ['/resume', t('nav.resume')],
    ['/contact', t('nav.contact')],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t('nav.skip')}
      </a>
      <header className={cn('site-header sticky top-0 z-40 w-full border-b transition-colors duration-300', scrolled ? 'border-border bg-background/80 backdrop-blur-md' : 'border-transparent')}>
        <div className={cn(container, 'flex h-16 items-center justify-between gap-4')}>
          <Link to={path('/')} className="flex items-center gap-2 font-bold" aria-label={profile.name}>
            <BrandMark className="h-6 w-auto text-primary" />
            <span>{profile.shortName}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {links.map(([to, label]) => (
              <NavLink key={to} to={path(to)} className={linkClass}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="icon" className="size-10 sm:size-9 md:hidden" aria-label={t('nav.menu')}>
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent closeLabel={t('nav.close')}>
                <SheetHeader>
                  <SheetTitle>{t('nav.menu')}</SheetTitle>
                  <SheetDescription className="sr-only">{profile.name}</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                  {links.map(([to, label]) => (
                    <SheetClose asChild key={to}>
                      <NavLink to={path(to)} className={({ isActive }) => cn('rounded-md px-3 py-2.5 text-base transition-colors hover:bg-accent', isActive ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground')}>
                        {label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main" lang={lang} className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-20">
        <Separator />
        <div className={cn(container, 'flex flex-wrap items-center justify-between gap-4 py-8')}>
          <div>
            <p className="font-semibold">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{t('footer.built')}</p>
            <p className="text-xs text-muted-foreground">
              {t('footer.logo')}{' '}
              <a className="underline underline-offset-2 hover:text-foreground" href="https://brand.ugm.ac.id/" target="_blank" rel="noopener noreferrer">
                brand.ugm.ac.id
              </a>
              ,{' '}
              <a className="underline underline-offset-2 hover:text-foreground" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                {t('footer.license')}
              </a>
              .
            </p>
            {analyticsEnabled && <p className="text-sm text-muted-foreground">{t('footer.analytics')}</p>}
          </div>
          <div className="flex gap-5 text-sm">
            <a className="text-muted-foreground transition-colors hover:text-foreground" href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href={`mailto:${profile.email}`}>
              Email
            </a>
            {resumeHref(primaryResumeKey) && (
              <a className="text-muted-foreground transition-colors hover:text-foreground" href={resumeHref(primaryResumeKey)!} download data-event={`resume-download-${primaryResumeKey}`}>
                {t('footer.resume')}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
