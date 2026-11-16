import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Link, NavLink } from '@/components/TransitionLink';
import { ArrowUp, Download, Mail, Menu, Moon, Sun } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { BrandMark } from '@/components/BrandMark';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AppIcon, type IconName } from '@/components/icons';
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

const footLink = 'link-underline group inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground';

function toTop() {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, left: 0, behavior: calm ? 'instant' : 'smooth' });
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn('relative py-1 text-sm transition-colors hover:text-foreground', isActive ? 'font-medium text-foreground' : 'text-muted-foreground');

export function Layout() {
  const { t, l, path, lang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  // The visit-statistics note is only for the developer's own machine; on the live site it is not shown (set after mount, so the pre-rendered pages stay the same)
  const [onLocalhost, setOnLocalhost] = useState(false);
  useEffect(() => setOnLocalhost(['localhost', '127.0.0.1'].includes(window.location.hostname)), []);

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

  const links: [string, string, IconName][] = [
    ['/work', t('nav.work'), 'grid'],
    ['/experience', t('nav.experience'), 'briefcase'],
    ['/about', t('nav.about'), 'user'],
    ['/resume', t('nav.resume'), 'file'],
    ['/contact', t('nav.contact'), 'mail'],
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
            {links.map(([to, label, icon]) => (
              <NavLink key={to} to={path(to)} className={linkClass}>
                <AppIcon name={icon} className="mr-1.5 inline size-3.5 align-[-2px]" />
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
                  {links.map(([to, label, icon]) => (
                    <SheetClose asChild key={to}>
                      <NavLink to={path(to)} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-foreground">
                        <AppIcon name={icon} />
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

      <footer className="relative mt-8 overflow-hidden print:mt-8">
        <div aria-hidden="true" className="h-px bg-[linear-gradient(to_right,transparent,var(--primary),transparent)] opacity-60" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(40rem_12rem_at_50%_100%,var(--glow),transparent_75%)] print:hidden" />
        <div className={cn(container, 'relative py-12')}>
          <div className="reveal-items flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{profile.name}</p>
              <p className="mt-1 font-medium text-primary">{l(profile.headline)}</p>
              <p className="mt-3 text-sm text-muted-foreground">{t('footer.built')}</p>
              {analyticsEnabled && onLocalhost && <p className="text-sm text-muted-foreground">{t('footer.analytics')}</p>}
            </div>
            <nav aria-label={t('footer.links')} className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              <a className={footLink} href={profile.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-4" aria-hidden="true" />
                GitHub
              </a>
              <a className={footLink} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="size-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a className={footLink} href={`mailto:${profile.email}`}>
                <Mail className="size-4" aria-hidden="true" />
                Email
              </a>
              {resumeHref(primaryResumeKey) && (
                <a className={footLink} href={resumeHref(primaryResumeKey)!} download data-event={`resume-download-${primaryResumeKey}`}>
                  <Download className="size-4" aria-hidden="true" />
                  {t('footer.resume')}
                </a>
              )}
              <Button type="button" variant="outline" size="sm" className="print:hidden" onClick={toTop}>
                <ArrowUp aria-hidden="true" />
                {t('footer.top')}
              </Button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
