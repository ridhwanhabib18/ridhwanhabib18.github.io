import { Link } from '@/components/TransitionLink';
import { ArrowRight, Download, Globe, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { CertCard } from '@/components/CertCard';
import { CopyButton } from '@/components/CopyButton';
import { AppIcon, IconTile } from '@/components/icons';
import { CountUp } from '@/components/CountUp';
import { Seo } from '@/components/Seo';
import { Stats } from '@/components/Stats';
import { Reveal } from '@/components/Reveal';
import { RotatingWord } from '@/components/RotatingWord';
import { CoreSkills, MetricBadge, ProjectCard, Section, StackChips } from '@/components/Parts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { featured, getProject, projects, proofSlugs } from '@/content/projects';
import { primaryResumeKey, resumeHref } from '@/content/resume';
import { graph, personLd, websiteLd } from '@/lib/jsonld';
import { container, eyebrow, h2 } from '@/lib/ui';
import { cn } from '@/lib/utils';

const heroLink =
  'inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none';
const rise = 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both motion-reduce:animate-none';

const proofItems = () =>
  proofSlugs.map((slug) => {
    const project = getProject(slug)!;
    return { slug, project, metric: project.metrics[0] };
  });

export default function Home() {
  const { t, l, path } = useI18n();
  const proof = proofItems();
  const alsoRoles = l(profile.alsoRoles);
  const mail = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio')}`;
  const feat = featured.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <>
      <Seo description={l(profile.positioning)} jsonLd={graph(websiteLd(), personLd())} />

      <section className="relative overflow-hidden border-b bg-[radial-gradient(60rem_28rem_at_75%_-10%,var(--glow),transparent_70%)]">
        <div className={cn(container, 'grid items-center gap-10 py-14 sm:py-20 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-16 xl:py-24')}>
          <div className={cn(rise, 'relative mx-auto xl:order-last')}>
            <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-xl" />
            <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border border-primary/40" />
            <img
              src={`${import.meta.env.BASE_URL}${profile.photo}`}
              alt={profile.name}
              width={320}
              height={320}
              className="relative size-44 rounded-[2rem] object-cover ring-1 ring-border dark:brightness-[0.86] dark:contrast-[1.05] sm:size-56 xl:size-72"
            />
          </div>
          <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
          {profile.available && (
            <Badge variant="outline" className={cn(rise, 'max-w-full gap-2 rounded-2xl px-3 py-1 text-center text-sm font-normal whitespace-normal text-muted-foreground sm:rounded-full')}>
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              {l(profile.availability)}
            </Badge>
          )}
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className={cn(rise, 'mt-4 text-xl font-semibold text-balance text-gradient sm:text-2xl')} style={{ animationDelay: '120ms' }}>
            {l(profile.headline)}
          </p>
          <p className={cn(rise, 'mt-3 font-mono text-sm text-muted-foreground')} style={{ animationDelay: '150ms' }}>
            <span className="sr-only">{`${t('home.also')}: ${alsoRoles.join(', ')}`}</span>
            <span aria-hidden="true" className="inline-flex items-center gap-2">
              <span className="text-primary">&gt;</span>
              <span className="inline-flex h-5 items-center text-left" style={{ minWidth: `${Math.max(...alsoRoles.map((w) => w.length)) + 1}ch` }}>
                <RotatingWord words={alsoRoles} />
              </span>
            </span>
          </p>
          <p className={cn(rise, 'mt-4 max-w-2xl text-lg text-muted-foreground')} style={{ animationDelay: '180ms' }}>
            {l(profile.positioning)}
          </p>
          <div className={cn(rise, 'mt-8 flex flex-wrap justify-center gap-3 xl:justify-start')} style={{ animationDelay: '240ms' }}>
            <Button asChild size="lg">
              <Link to={path('/work')}>
                {t('cta.viewWork')}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={path('/contact')}>{t('cta.contact')}</Link>
            </Button>
            {resumeHref(primaryResumeKey) && (
              <Button asChild size="lg" variant="ghost">
                <a href={resumeHref(primaryResumeKey)!} download data-event={`resume-download-${primaryResumeKey}`}>
                  <Download aria-hidden="true" />
                  {t('cta.downloadResume')}
                </a>
              </Button>
            )}
          </div>
          <ul aria-label={t('home.links')} className={cn(rise, 'mt-5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm xl:-ml-2.5 xl:justify-start')} style={{ animationDelay: '270ms' }}>
            <li>
              <a className={heroLink} href={mail} data-event="email-click">
                <Mail className="size-4" aria-hidden="true" />
                {t('contact.email')}
              </a>
            </li>
            <li>
              <a className={heroLink} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="size-4" aria-hidden="true" />
                {t('contact.linkedin')}
              </a>
            </li>
            <li>
              <a className={heroLink} href={profile.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-4" aria-hidden="true" />
                {t('contact.github')}
              </a>
            </li>
            <li>
              <a className={heroLink} href={profile.website+"/work"} target="_blank" rel="noopener noreferrer">
                <Globe className="size-4" aria-hidden="true" />
                {t('contact.website')}
              </a>
            </li>
          </ul>
          <p className={cn(rise, 'mt-6 text-sm text-muted-foreground')} style={{ animationDelay: '300ms' }}>
            {profile.yearsExperience} {t('home.years')} · {l(profile.location)}
          </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="stats-h" className="border-b py-6">
        <div className={container}>
          <h2 id="stats-h" className="sr-only">
            {t('about.stats')}
          </h2>
          <Stats />
        </div>
      </section>

      <section aria-labelledby="cert-h" className="border-b py-6">
        <div className={container}>
          <h2 id="cert-h" className={cn(eyebrow, 'mb-3 flex items-center gap-2')}>
            <AppIcon name="award" />
            {t('home.certs')}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {profile.certifications.map((c) => (
              <li key={c.name}>
                <CertCard cert={c} compact />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="proof-h" icon="target" title={t('home.proof')} lead={t('home.proofNote')}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.06}>
              <Link to={path(`/work/${p.slug}`)} className="block h-full rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none">
                <Card className="h-full gap-2 transition-colors hover:border-primary/60">
                  <CardContent className="flex flex-col items-start gap-2">
                    <MetricBadge type={p.metric.type} />
                    <strong className="text-gradient text-2xl leading-tight">
                      <CountUp text={l(p.metric.value)} />
                    </strong>
                    <span className="text-sm text-foreground">{l(p.project.proofLabel ?? p.metric.label)}</span>
                    <span className="text-xs text-muted-foreground">{l(p.project.title)}</span>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        id="feat-h"
        icon="grid"
        title={t('home.featured')}
        lead={t('home.featuredLead')}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to={path('/work')}>
              {t('cta.allWork')}
              <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feat.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="how-h" icon="wrench" title={t('about.how')}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.howIWork.map((h) => (
            <li key={h.title.en} className="flex gap-3">
              <IconTile name={h.icon} />
              <div>
                <h3 className="font-semibold">{l(h.title)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l(h.body)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="stack-h"
        icon="terminal"
        title={t('home.stack')}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to={path('/about')}>
              {t('home.stackAll')}
              <ArrowRight />
            </Link>
          </Button>
        }
      >
        <CoreSkills className="mb-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profile.stack.map((g) => (
            <div key={g.group.en}>
              <h3 className={cn(eyebrow, 'mb-2')}>{l(g.group)}</h3>
              <StackChips items={g.items.slice(0, 8)} />
            </div>
          ))}
        </div>
      </Section>

      <section aria-labelledby="cta-h" className="py-12 sm:py-16">
        <div className={container}>
        <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border bg-card/60 px-6 py-12 text-center sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_16rem_at_50%_0%,var(--glow),transparent_75%)]" />
          <div className="relative flex flex-col items-center">
          <h2 id="cta-h" className={cn(h2, 'flex items-center gap-3')}>
            <IconTile name="message" size="sm" />
            {t('home.ctaTitle')}
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">{t('contact.lead')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={mail} data-event="email-click">
                <Mail aria-hidden="true" />
                {t('contact.cta')}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon aria-hidden="true" />
                {t('contact.linkedin')}
              </a>
            </Button>
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <a className="font-medium text-primary hover:underline" href={mail} data-event="email-click">
              {profile.email}
            </a>
            <CopyButton value={profile.email} />
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-2">
            <Link to={path('/contact')}>
              {t('cta.contact')}
              <ArrowRight />
            </Link>
          </Button>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
