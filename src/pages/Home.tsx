import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { MetricBadge, ProjectCard, Section, StackChips } from '@/components/Parts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { featured, getProject, projects, proofSlugs } from '@/content/projects';
import { container, eyebrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

const rise = 'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both motion-reduce:animate-none';

const proofItems = () =>
  proofSlugs.map((slug) => ({
    slug,
    metric: getProject(slug)!.metrics[0],
  }));

export default function Home() {
  const { t, l, path } = useI18n();
  const proof = proofItems();
  const feat = featured.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <>
      <Seo description={l(profile.positioning)} />

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
          <h1 className={cn(rise, 'mt-6 max-w-4xl text-4xl font-extrabold text-balance sm:text-5xl lg:text-6xl')} style={{ animationDelay: '60ms' }}>
            {profile.name}
          </h1>
          <p className={cn(rise, 'mt-4 text-xl font-semibold text-primary sm:text-2xl')} style={{ animationDelay: '120ms' }}>
            {l(profile.headline)}
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
          </div>
          <p className={cn(rise, 'mt-6 text-sm text-muted-foreground')} style={{ animationDelay: '300ms' }}>
            {profile.yearsExperience} {t('home.years')} · {l(profile.location)}
          </p>
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
                    <strong className="text-2xl leading-tight">{l(p.metric.value)}</strong>
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

      <Section id="cert-h" title={t('home.certs')}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {profile.certifications.map((c) => (
            <li key={c.name}>
              <Card className="h-full gap-2">
                <CardContent className="flex flex-col items-start gap-2">
                  {c.level && <Badge variant="secondary">{l(c.level)}</Badge>}
                  <strong>{c.name}</strong>
                  {c.issuer && <span className="text-sm text-muted-foreground">{c.issuer}</span>}
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {t('home.verify')}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
