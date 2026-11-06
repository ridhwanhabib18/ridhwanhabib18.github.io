import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { PersonalProjectCard, ProjectCard } from '@/components/Parts';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { personalProjects } from '@/content/personal-projects';
import { projects } from '@/content/projects';
import type { Tag } from '@/content/types';
import { container, h2 } from '@/lib/ui';
import { cn } from '@/lib/utils';

const TAGS: Tag[] = ['aspnet', 'react', 'realtime', 'integration', 'data'];
type Scope = 'all' | 'professional' | 'personal';

export default function Work() {
  const { t } = useI18n();
  const [tag, setTag] = useState<Tag | null>(null);
  const [scope, setScope] = useState<Scope>('all');

  const group = (kind: 'delivered' | 'contributed', heading: string) => {
    const list = projects.filter((p) => p.kind === kind && (!tag || p.tags.includes(tag)));
    if (!list.length) return null;
    return (
      <div className="mt-6" role="group" aria-labelledby={`h-${kind}`}>
        <h3 id={`h-${kind}`} className="mb-4 text-lg font-semibold">
          {heading}
        </h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    );
  };

  const personal = personalProjects.filter((p) => !tag || p.tags.includes(tag));
  const showProfessional = scope !== 'personal' && projects.some((p) => !tag || p.tags.includes(tag));
  const showPersonal = scope !== 'professional' && personal.length > 0;

  const scopes: [Scope, string][] = [
    ['all', t('work.all')],
    ['professional', t('work.scopeProfessional')],
    ['personal', t('work.scopePersonal')],
  ];

  return (
    <>
      <Seo title={t('work.title')} description={t('work.lead')} />
      <div className={cn(container, 'py-12')}>
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('work.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t('work.lead')}</p>
        </header>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('work.scope')}>
            {scopes.map(([key, label]) => (
              <Button key={key} type="button" size="sm" variant={scope === key ? 'default' : 'outline'} aria-pressed={scope === key} onClick={() => setScope(key)}>
                {label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t('work.filter')}>
            <Button type="button" size="sm" variant={tag === null ? 'secondary' : 'ghost'} aria-pressed={tag === null} onClick={() => setTag(null)}>
              {t('work.allTopics')}
            </Button>
            {TAGS.map((x) => (
              <Button key={x} type="button" size="sm" variant={tag === x ? 'secondary' : 'ghost'} aria-pressed={tag === x} onClick={() => setTag(x)}>
                {t(`tag.${x}`)}
              </Button>
            ))}
          </div>
        </div>

        {showProfessional && (
          <section className="mt-10" aria-labelledby="h-professional">
            <h2 id="h-professional" className={h2}>
              {t('work.professional')}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t('work.professionalLead')}</p>
            {group('delivered', t('work.delivered'))}
            {group('contributed', t('work.contributed'))}
          </section>
        )}

        {showPersonal && (
          <section className="mt-12" aria-labelledby="h-personal">
            <h2 id="h-personal" className={h2}>
              {t('work.personal')}
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t('work.personalLead')}</p>
            <div className="mt-6 grid gap-5">
              {personal.map((p) => (
                <PersonalProjectCard key={p.slug} p={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
