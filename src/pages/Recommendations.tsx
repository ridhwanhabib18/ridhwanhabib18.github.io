import { Link } from '@/components/TransitionLink';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from '@/components/BrandIcons';
import { AppIcon } from '@/components/icons';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { recommendations } from '@/content/recommendations';
import { eyebrow, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

export default function Recommendations() {
  const { t, l, path } = useI18n();
  return (
    <>
      <Seo title={t('rec.title')} description={t('rec.lead')} />
      <div className={cn(narrow, 'py-12')}>
        <header className="stagger">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('rec.title')}</h1>
          <p className="mt-3 mb-8 text-lg text-muted-foreground">{t('rec.lead')}</p>
        </header>

        <ul className="reveal-items grid gap-4">
          {recommendations.map((r) => (
            <li key={r.slug}>
              <Card className="lift h-full gap-3">
                <CardContent className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20" aria-hidden="true">
                    {r.source === 'LinkedIn' ? <LinkedinIcon className="size-5" /> : <AppIcon name="book" className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={eyebrow}>
                      {r.source} · {r.author}
                    </p>
                    <h2 className="mt-1 text-xl font-bold">{l(r.title)}</h2>
                    <p className="mt-2 text-muted-foreground">{l(r.summary)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {r.takeaways && (
                        <Button asChild size="sm">
                          <Link to={path(`/recommendations/${r.slug}`)}>
                            {t('rec.read')}
                            <ArrowRight />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <a href={r.url} target="_blank" rel="noopener noreferrer" data-event="recommendation-open">
                          {t('rec.open')} {r.source}
                          <ExternalLink aria-hidden="true" />
                          <span className="sr-only"> ({t('rec.newTab')})</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
