import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Diagram, MetricRow, StackChips } from '@/components/Parts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/i18n';
import { getProject, projects } from '@/content/projects';
import { bullets, h2, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import NotFound from './NotFound';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className={cn(h2, 'mb-3 text-2xl')}>{title}</h2>
      {children}
    </section>
  );
}

export default function WorkDetail() {
  const { slug = '' } = useParams();
  const { t, l, path } = useI18n();
  const p = getProject(slug);
  if (!p) return <NotFound />;

  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[i - 1];
  const next = projects[i + 1];
  const s = p.sections;
  const list = (items: string[]) => (
    <ul className={bullets}>
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );

  return (
    <>
      <Seo title={l(p.title)} description={l(p.summary)} />
      <article className={cn(narrow, 'py-12 leading-relaxed')}>
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to={path('/work')}>
            <ArrowLeft />
            {t('cta.back')}
          </Link>
        </Button>
        <header className="mt-4">
          <Badge variant={p.kind === 'delivered' ? 'default' : 'outline'}>{t(`badge.${p.kind}`)}</Badge>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{l(p.title)}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{l(p.summary)}</p>
          <p className="mt-4">
            <strong>{t('work.role')}:</strong> {l(p.role)}
          </p>
          {p.metrics.length > 0 && (
            <ul className="mt-4 space-y-2 rounded-xl border bg-card p-4">
              {p.metrics.map((m) => (
                <MetricRow key={m.label.en} m={m} />
              ))}
            </ul>
          )}
        </header>

        <Block title={t('work.context')}>
          <p>{l(s.context)}</p>
        </Block>
        <Block title={t('work.problem')}>
          <p>{l(s.problem)}</p>
        </Block>
        <Block title={t('work.approach')}>{list(l(s.approach))}</Block>
        {p.diagram && (
          <Block title={t('work.architecture')}>
            <Diagram def={p.diagram} title={`${l(p.title)}: ${t('work.architecture')}`} />
            <p className="mt-2 text-sm text-muted-foreground">{t('work.architectureNote')}</p>
          </Block>
        )}
        {s.decisions && <Block title={t('work.decisions')}>{list(l(s.decisions))}</Block>}
        <Block title={t('work.result')}>{list(l(s.result))}</Block>
        {s.lookback && <Block title={t('work.lookback')}>{list(l(s.lookback))}</Block>}
        <Block title={t('work.stack')}>
          <StackChips items={p.stack} />
        </Block>

        <Separator className="mt-14" />
        <nav className="mt-6 flex justify-between gap-4 text-sm" aria-label="Case studies">
          {prev ? (
            <Link to={path(`/work/${prev.slug}`)} className="inline-flex items-center gap-1 text-primary hover:underline">
              <ArrowLeft className="size-4" />
              {l(prev.title)}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={path(`/work/${next.slug}`)} className="inline-flex items-center gap-1 text-primary hover:underline">
              {l(next.title)}
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </>
  );
}
