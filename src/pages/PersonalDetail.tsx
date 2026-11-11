import { ArrowLeft, Check, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/components/TransitionLink';
import { Seo } from '@/components/Seo';
import { AppIcon, IconTile, personalIcons } from '@/components/icons';
import { Diagram, StackChips } from '@/components/Parts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import type { PersonalProject } from '@/content/personal-projects';
import { breadcrumbLd, graph } from '@/lib/jsonld';
import { bullets, container, eyebrow, h2 } from '@/lib/ui';
import { cn } from '@/lib/utils';

function Block({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="mt-14" aria-labelledby={id}>
      <h2 id={id} className={cn(h2, 'text-2xl')}>
        {title}
      </h2>
      {lead && <p className="mt-2 max-w-3xl text-muted-foreground">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ExternalButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="outline" size="sm">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <ExternalLink aria-hidden="true" />
      </a>
    </Button>
  );
}

/** The page of a personal project: what it is, its features, architecture, design, decisions, stack, phases, docs and pictures. */
export default function PersonalDetail({ p }: { p: PersonalProject }) {
  const { t, l, path } = useI18n();
  const base = `${import.meta.env.BASE_URL}projects/${p.slug}/`;
  const flows = p.gallery.filter((g) => g.kind === 'flow');
  const shots = p.gallery.filter((g) => g.kind === 'shot');
  const doneCount = p.phases.filter((x) => x.done).length;

  return (
    <>
      <Seo
        title={l(p.title)}
        description={l(p.summary)}
        jsonLd={graph(breadcrumbLd([
          { name: t('nav.home'), path: path('/') },
          { name: t('nav.work'), path: path('/work') },
          { name: l(p.title), path: path(`/work/${p.slug}`) },
        ]))}
      />
      <article className={cn(container, 'py-12 leading-relaxed')}>
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to={path('/work')}>
            <ArrowLeft />
            {t('cta.back')}
          </Link>
        </Button>

        <header className="stagger mt-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <AppIcon name="user" />
              {t('badge.personal')}
            </Badge>
            <Badge variant={p.state === 'done' ? 'success' : 'warning'}>
              <AppIcon name={p.state === 'done' ? 'check' : 'progress'} />
              {t(`state.${p.state}`)}
            </Badge>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <AppIcon name="calendar" className="size-3.5" />
              {p.year}
            </span>
          </div>
          <h1 className="mt-3 text-4xl font-extrabold text-balance sm:text-5xl">{l(p.title)}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{l(p.summary)}</p>
          <p className="mt-4 text-sm">{`${t('personal.status')}: ${l(p.status)}`}</p>
          <p className="mt-1 text-sm text-muted-foreground">{`${t('card.role')}: ${l(p.role)}`}</p>
{p.links.length > 0 && (
<>
          <ul aria-label={t('personal.links')} className="mt-5 flex flex-wrap gap-2">
            {p.links.map((x) => (
              <li key={x.href}>
                <ExternalButton href={x.href}>{l(x.label)}</ExternalButton>
              </li>
            ))}
          </ul>
</>
)}
        </header>

        <Block id="p-overview" title={t('personal.overview')}>
          <div className="reveal-items max-w-3xl space-y-4">
            {l(p.overview).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <h3 className={cn(eyebrow, 'mt-8 mb-3')}>{t('personal.highlights')}</h3>
          <ul className={cn(bullets, 'reveal-items max-w-3xl')}>
            {l(p.highlights).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
{p.roles.length > 0 && (
<>
          <h3 className={cn(eyebrow, 'mt-8 mb-3')}>{t('personal.roles')}</h3>
          <ul className="reveal-items grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.roles.map((r) => (
              <li key={r.name.en} className="flex gap-3 rounded-lg border bg-card p-4">
                <IconTile name={personalIcons.roles[r.name.en as keyof typeof personalIcons.roles]} size="sm" />
                <div>
                  <strong>{l(r.name)}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{l(r.needs)}</p>
                </div>
              </li>
            ))}
          </ul>
</>
)}
        </Block>

        <Block id="p-features" title={t('personal.features')}>
          <ul className="reveal-items grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <li key={f.id} className="flex gap-3 rounded-lg border bg-card p-4">
                <IconTile name={personalIcons.features[f.id as keyof typeof personalIcons.features]} size="sm" />
                <div>
                  <span className="font-mono text-xs text-muted-foreground">{f.id}</span>
                  <strong className="block">{l(f.title)}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{l(f.note)}</p>
                </div>
              </li>
            ))}
          </ul>
{p.aiFeatures.length > 0 && (
<>
          <h3 className={cn(eyebrow, 'mt-8 mb-3')}>{t('personal.ai')}</h3>
          <ul className="reveal-items grid gap-2 sm:grid-cols-2">
            {p.aiFeatures.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-sm">
                <AppIcon name="sparkles" className="size-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                {l(a.title)}
              </li>
            ))}
          </ul>
</>
)}
        </Block>

        <Block id="p-architecture" title={t('personal.architecture')} lead={l(p.architecture.intro)}>
          <div className="space-y-8">
            {p.architecture.diagrams.map((d) => (
              <div key={d.title.en}>
                <h3 className="mb-3 font-semibold">{l(d.title)}</h3>
                <Diagram def={d.def} title={l(d.title)} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('work.architectureNote')}</p>
          <h3 className={cn(eyebrow, 'mt-8 mb-3')}>{t('personal.layers')}</h3>
          <ul className="reveal-items grid gap-3 md:grid-cols-2">
            {p.architecture.layers.map((x) => (
              <li key={x.name} className="rounded-lg border bg-card p-4">
                <strong>{x.name}</strong>
                <p className="mt-1 text-sm">{l(x.does)}</p>
                <p className="mt-2 text-xs text-muted-foreground">{`${t('personal.dependsOn')}: ${l(x.dependsOn)}`}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="p-design" title={t('personal.design')}>
          <h3 className={cn(eyebrow, 'mb-3')}>{t('personal.quality')}</h3>
          <ul className="reveal-items grid gap-3 md:grid-cols-2">
            {p.qualityGoals.map((q) => (
              <li key={q.goal.en} className="flex gap-3 rounded-lg border bg-card p-4 text-sm">
                <IconTile name={personalIcons.quality[q.goal.en as keyof typeof personalIcons.quality]} size="sm" />
                <div>
                  <strong className="text-base">{l(q.goal)}</strong>
                  <p className="mt-1">{`${t('personal.target')}: ${l(q.target)}`}</p>
                  <p className="mt-1 text-muted-foreground">{`${t('personal.response')}: ${l(q.response)}`}</p>
                </div>
              </li>
            ))}
          </ul>
          {p.design.map((d) => (
            <div key={d.title.en} className="mt-8 max-w-3xl">
              <h3 className="mb-2 flex items-center gap-3 text-lg font-semibold">
                <IconTile name={personalIcons.design[d.title.en as keyof typeof personalIcons.design]} size="sm" />
                {l(d.title)}
              </h3>
              <div className="space-y-3">
                {l(d.body).map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>
          ))}
{p.dataModules.length > 0 && (
<>
          <h3 className={cn(eyebrow, 'mt-8 mb-3')}>{t('personal.dataModel')}</h3>
          <StackChips items={p.dataModules} />
</>
)}
        </Block>

{p.decisions.length > 0 && (
<>
        <Block id="p-decisions" title={t('personal.decisions')}>
          <ul className="reveal-items grid gap-3 md:grid-cols-2">
            {p.decisions.map((d) => (
              <li key={d.id} className="flex gap-3 rounded-lg border bg-card p-4">
                <IconTile name="scale" size="sm" />
                <div>
                  <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                  <strong className="block">{l(d.title)}</strong>
                  <p className="mt-1 text-sm text-muted-foreground">{l(d.summary)}</p>
                  {d.href && (
                  <a href={d.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {t('personal.readAdr')}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Block>

</>
)}
        <Block id="p-stack" title={t('personal.stack')}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.stackGroups.map((g) => (
              <div key={g.group.en}>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <AppIcon name={personalIcons.stack[g.group.en as keyof typeof personalIcons.stack]} className="text-primary" />
                  {l(g.group)}
                </h3>
                <StackChips items={g.items} />
              </div>
            ))}
          </div>
        </Block>

{p.phases.length > 0 && (
<>
        <Block id="p-phases" title={t('personal.phases')} lead={`${doneCount} / ${p.phases.length} ${t('personal.phasesDone')}`}>
          <ol className="grid max-w-3xl gap-2">
            {p.phases.map((x) => (
              <li key={x.n} className="flex items-start gap-3 text-sm">
                <span className={cn('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs', x.done ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground')} aria-hidden="true">
                  {x.done ? <Check className="size-3" /> : x.n}
                </span>
                <span>
                  <strong>{`${t('personal.phase')} ${x.n}`}</strong> {l(x.scope)}
                  {x.note && <span className="block text-muted-foreground">{l(x.note)}</span>}
                </span>
              </li>
            ))}
          </ol>
        </Block>

</>
)}
{p.docs.length > 0 && (
<>
        <Block id="p-docs" title={t('personal.docs')}>
          <ul className="reveal-items grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {p.docs.map((d) => (
              <li key={d.href}>
                <a href={d.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
                  <AppIcon name="file" className="text-muted-foreground" />
                  {l(d.label)}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </Block>

</>
)}
        <Block id="p-start" title={t('personal.start')} lead={`${t('personal.requirements')}: ${l(p.gettingStarted.requirements)}`}>
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <AppIcon name="terminal" className="text-primary" />
            {t('personal.start')}
          </div>
          <pre tabIndex={0} aria-label={t('personal.start')} className="max-w-3xl overflow-x-auto rounded-lg border bg-card p-4 font-mono text-sm">
            <code>{p.gettingStarted.commands.join('\n')}</code>
          </pre>
        </Block>

        <Block id="p-gallery" title={t('personal.gallery')} lead={t('personal.galleryNote')}>
          <h3 className={cn(eyebrow, 'mb-3 flex items-center gap-2')}>
            <AppIcon name="play" />
            {t('personal.flows')}
          </h3>
          <ul className="reveal-items grid gap-5 md:grid-cols-2">
            {flows.map((g) => (
              <li key={g.file}>
                <figure>
                  <img src={`${base}${g.file}`} alt={l(g.caption)} width={g.width} height={g.height} loading="lazy" decoding="async" className="h-auto w-full rounded-lg border motion-reduce:hidden" />
                  <a href={`${base}${g.file}`} target="_blank" rel="noopener noreferrer" className="hidden rounded-lg border bg-card p-4 text-sm font-medium text-primary hover:underline motion-reduce:block">
                    {`${t('personal.viewAnimation')}: ${l(g.caption)}`}
                  </a>
                  <figcaption className="mt-2 text-sm text-muted-foreground">{l(g.caption)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <h3 className={cn(eyebrow, 'mt-10 mb-3 flex items-center gap-2')}>
            <AppIcon name="image" />
            {t('personal.screens')}
          </h3>
          <ul className="reveal-items grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shots.map((g) => (
              <li key={g.file} className={g.file.endsWith('.svg') ? 'sm:col-span-2 lg:col-span-3' : undefined}>
                <figure>
                  <img src={`${base}${g.file}`} alt={l(g.caption)} width={g.width} height={g.height} loading="lazy" decoding="async" className={cn('h-auto rounded-lg border', g.file.endsWith('.svg') ? 'w-full max-w-3xl' : g.width < 600 ? 'w-40' : 'w-full')} />
                  <figcaption className="mt-2 text-sm text-muted-foreground">{l(g.caption)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Block>
      </article>
    </>
  );
}
