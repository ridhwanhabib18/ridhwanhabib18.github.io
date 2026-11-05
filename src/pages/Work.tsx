import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { ProjectCard } from '@/components/Parts';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { projects } from '@/content/projects';
import type { Tag } from '@/content/types';
import { container, h2 } from '@/lib/ui';
import { cn } from '@/lib/utils';

const TAGS: Tag[] = ['aspnet', 'react', 'realtime', 'integration', 'data'];

export default function Work() {
  const { t, l } = useI18n();
  const [tag, setTag] = useState<Tag | null>(null);

  const group = (kind: 'delivered' | 'contributed', heading: string) => {
    const list = projects.filter((p) => p.kind === kind && (!tag || p.tags.includes(tag)));
    if (!list.length) return null;
    return (
      <section className="mt-10" aria-labelledby={`h-${kind}`}>
        <h2 id={`h-${kind}`} className={cn(h2, 'mb-5')}>
          {heading}
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <Seo title={t('work.title')} description={t('work.lead')} />
      <div className={cn(container, 'py-12')}>
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('work.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t('work.lead')}</p>
        </header>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('work.filter')}>
          <Button type="button" size="sm" variant={tag === null ? 'default' : 'outline'} aria-pressed={tag === null} onClick={() => setTag(null)}>
            {t('work.all')}
          </Button>
          {TAGS.map((x) => (
            <Button key={x} type="button" size="sm" variant={tag === x ? 'default' : 'outline'} aria-pressed={tag === x} onClick={() => setTag(x)}>
              {t(`tag.${x}`)}
            </Button>
          ))}
        </div>
        {group('delivered', t('work.delivered'))}
        {group('contributed', t('work.contributed'))}
        <p className="mt-10 text-sm text-muted-foreground">{l({ en: 'Results are percentages only and labelled Actual or Target.', id: 'Hasil hanya berupa persentase dan diberi label Aktual atau Target.' })}</p>
      </div>
    </>
  );
}
