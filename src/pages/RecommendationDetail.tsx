import { useParams } from 'react-router-dom';
import { Link } from '@/components/TransitionLink';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { breadcrumbLd, graph } from '@/lib/jsonld';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { getRecommendation } from '@/content/recommendations';
import { bullets, eyebrow, h2, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';
import NotFound from './NotFound';

export default function RecommendationDetail() {
  const { slug = '' } = useParams();
  const { t, l, path } = useI18n();
  const r = getRecommendation(slug);
  if (!r || !r.takeaways) return <NotFound />;

  return (
    <>
      <Seo
        title={l(r.title)}
        description={l(r.summary)}
        jsonLd={graph(
          breadcrumbLd([
            { name: t('nav.home'), path: path('/') },
            { name: t('nav.recommendations'), path: path('/recommendations') },
            { name: l(r.title), path: path(`/recommendations/${r.slug}`) },
          ]),
        )}
      />
      <article className={cn(narrow, 'py-12 leading-relaxed')}>
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link to={path('/recommendations')}>
            <ArrowLeft />
            {t('rec.back')}
          </Link>
        </Button>
        <header className="stagger mt-4">
          <p className={eyebrow}>
            {r.source} · {r.author}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-balance sm:text-4xl">{l(r.title)}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{l(r.summary)}</p>
        </header>

        <section className="mt-10">
          <h2 className={cn(h2, 'mb-3 text-2xl')}>{t('rec.points')}</h2>
          <ul className={cn(bullets, 'reveal-items')}>
            {l(r.takeaways).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>

        {r.stages && (
          <section className="mt-10">
            <h2 className={cn(h2, 'mb-4 text-2xl')}>{t('rec.order')}</h2>
            <div className="space-y-8">
              {r.stages.map((stage, si) => {
                const first = r.stages!.slice(0, si).reduce((n, x) => n + x.books.length, 0) + 1;
                return (
                  <div key={stage.title.en}>
                    <h3 className="mb-3 font-semibold">{l(stage.title)}</h3>
                    <ol start={first} className="reveal-items space-y-3">
                      {stage.books.map((b, bi) => (
                        <li key={b.title} className="flex items-start gap-3 rounded-xl border bg-card/60 p-4">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-semibold text-primary ring-1 ring-primary/20" aria-hidden="true">
                            {first + bi}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold">
                              <span className="sr-only">{first + bi}. </span>
                              {b.title}
                            </p>
                            <p className="text-sm text-muted-foreground">{b.author}</p>
                            <p className="mt-1.5 text-sm">{l(b.text)}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {r.people && (
          <section className="mt-10">
            <h2 className={cn(h2, 'mb-4 text-2xl')}>{l(r.people.heading)}</h2>
            <div className="space-y-8">
              {r.people.groups.map((g) => (
                <div key={g.title.en}>
                  <h3 className="mb-3 font-semibold">{l(g.title)}</h3>
                  <ul className="reveal-items grid gap-3 sm:grid-cols-2">
                    {g.people.map((person) => (
                      <li key={person.name} className="rounded-xl border bg-card/60 px-4 py-3">
                        <p className="font-semibold">
                          {person.url ? (
                            <a href={person.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline" data-event="recommendation-person">
                              {person.name}
                              <ExternalLink className="size-3.5" aria-hidden="true" />
                              <span className="sr-only"> ({t('rec.newTab')})</span>
                            </a>
                          ) : (
                            person.name
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{l(person.focus)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {r.more && (
          <section className="mt-10">
            <h2 className={cn(h2, 'mb-3 text-2xl')}>{l(r.more.heading)}</h2>
            <ul className={cn(bullets, 'reveal-items')}>
              {r.more.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-8 text-sm text-muted-foreground">{t('rec.credit')}</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <a href={r.url} target="_blank" rel="noopener noreferrer" data-event="recommendation-open">
            {t('rec.open')} {r.source}
            <ExternalLink aria-hidden="true" />
            <span className="sr-only"> ({t('rec.newTab')})</span>
          </a>
        </Button>
      </article>
    </>
  );
}
