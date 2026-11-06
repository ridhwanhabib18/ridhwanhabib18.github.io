import { Link } from '@/components/TransitionLink';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { CertCard } from '@/components/CertCard';
import { CopyButton } from '@/components/CopyButton';
import { AppIcon, IconTile } from '@/components/icons';
import { CountUp } from '@/components/CountUp';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { RotatingWord } from '@/components/RotatingWord';
import { MetricBadge, ProjectCard, Section, StackChips } from '@/components/Parts';
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
  proofSlugs.map((slug) => ({
    slug,
    metric: getProject(slug)!.metrics[0],
  }));

export default function Home() {
  const { t, l, path } = useI18n();
  const proof = proofItems();
  const alsoRoles = l(profile.alsoRoles);
  const mail = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio')}`;
  const feat = featured.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <>
      <Seo description={l(profile.positioning)} jsonLd={graph(websiteLd(), personLd())} />

      <section className="relative overflow-hidden border-b bg-[radial-gradient(60rem_26rem_at_50%_-8%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)]">
        <div className={cn(container, 'flex flex-col items-center py-16 text-center sm:py-24')}>
          <img
            src={`${import.meta.env.BASE_URL}${profile.photo}`}
            alt={profile.name}
            width={112}
            height={112}
            className={cn(rise, 'mb-6 size-24 rounded-full object-cover ring-2 ring-primary/40 ring-offset-4 ring-offset-background sm:size-28')}
          />
          {profile.available && (
            <Badge variant="outline" className={cn(rise, 'max-w-full gap-2 rounded-2xl px-3 py-1 text-center text-sm font-normal whitespace-normal text-muted-foreground sm:rounded-full')}>
              <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              {l(profile.availability)}
            </Badge>
          )}
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className={cn(rise, 'mt-4 text-xl font-semibold text-balance text-primary sm:text-2xl')} style={{ animationDelay: '120ms' }}>
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
          <div className={cn(rise, 'mt-8 flex flex-wrap justify-center gap-3')} style={{ animationDelay: '240ms' }}>
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
          <ul aria-label={t('home.links')} className={cn(rise, 'mt-5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm')} style={{ animationDelay: '270ms' }}>
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
          </ul>
          <p className={cn(rise, 'mt-6 text-sm text-muted-foreground')} style={{ animationDelay: '300ms' }}>
            {profile.yearsExperience} {t('home.years')} · {l(profile.location)}
          </p>
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

      <Section id="proof-h" title={t('home.proof')} lead={t('home.proofNote')}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.06}>
              <Link to={path(`/work/${p.slug}`)} className="block h-full rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none">
                <Card className="h-full gap-2 transition-colors hover:border-primary/60">
                  <CardContent className="flex flex-col items-start gap-2">
                    <MetricBadge type={p.metric.type} />
                    <strong className="text-2xl leading-tight">
                      <CountUp text={l(p.metric.value)} />
                    </strong>
                    <span className="text-sm text-muted-foreground">{l(p.metric.label)}</span>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        id="feat-h"
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

      <Section id="how-h" title={t('about.how')}>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profile.stack.map((g) => (
            <div key={g.group.en}>
              <h3 className={cn(eyebrow, 'mb-2')}>{l(g.group)}</h3>
              <StackChips items={g.items.slice(0, 8)} />
            </div>
          ))}
        </div>
      </Section>

      <section aria-labelledby="cta-h" className="border-t bg-card/40 py-12 sm:py-14">
        <div className={cn(container, 'flex flex-col items-center text-center')}>
          <h2 id="cta-h" className={h2}>
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
      </section>
    </>
  );
}
