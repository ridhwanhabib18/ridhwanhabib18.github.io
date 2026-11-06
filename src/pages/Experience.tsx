import { useState } from 'react';
import { Link } from '@/components/TransitionLink';
import { ChevronDown } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { EducationEntry, StackChips } from '@/components/Parts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useI18n } from '@/i18n';
import { roles } from '@/content/experience';
import { profile } from '@/content/profile';
import { getProject } from '@/content/projects';
import { bullets, container, eyebrow } from '@/lib/ui';
import { capitalize, cn } from '@/lib/utils';

function Dot({ current }: { current?: boolean }) {
  return (
    <span className="timeline-dot absolute top-6 -left-6 flex size-4 sm:-left-8 items-center justify-center rounded-full border-2 border-primary bg-background" aria-hidden="true">
      {current && <span className="size-1.5 animate-pulse-soft rounded-full bg-primary" />}
    </span>
  );
}

export default function Experience() {
  const { t, l, path } = useI18n();
  const [open, setOpen] = useState<Record<string, boolean>>({ epson: true });

  return (
    <>
      <Seo title={t('exp.title')} description={t('exp.lead')} />
      <div className={cn(container, 'py-12')}>
        <header className="mb-10">
          <Badge>
            {profile.yearsExperience} {t('home.years')}
          </Badge>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{t('exp.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t('exp.lead')}</p>
        </header>

        <ol className="timeline-progress relative max-w-3xl space-y-5 pl-6 sm:pl-8 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-border">
          {roles.map((r, i) => {
            const current = r.end === null;
            const projs = r.projectSlugs.map((s) => getProject(s)).filter((p): p is NonNullable<typeof p> => !!p);
            return (
              <Reveal as="li" key={r.id} delay={i * 0.08} className="relative">
                <Dot current={current} />
                <Card className="gap-3">
                  <CardContent className="px-4 sm:px-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="flex flex-wrap items-center gap-2 text-xl font-bold">
                          {r.company}
                          {current && <Badge variant="success">{t('badge.current')}</Badge>}
                        </h2>
                        <p className="mt-1 font-medium text-primary">{l(r.title)}</p>
                      </div>
                      <p className="text-left text-sm text-muted-foreground sm:text-right">
                        {r.start} – {r.end ?? t('exp.present')}
                        <br />
                        {r.location}
                      </p>
                    </div>

                    <Collapsible open={!!open[r.id]} onOpenChange={(v) => setOpen((o) => ({ ...o, [r.id]: v }))} className="mt-3">
                      <CollapsibleTrigger className="group flex w-full print:hidden items-center justify-between border-t py-3 text-sm font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                        {t('exp.responsibilities')}
                        <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
                      </CollapsibleTrigger>
                      <CollapsibleContent forceMount className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down print:block print:h-auto">
                        <ul className={cn(bullets, 'pb-2')}>
                          {r.bullets.map((b) => (
                            <li key={l(b.text)}>
                              {b.title && <strong>{l(b.title)}: </strong>}
                              {capitalize(l(b.text))}
                            </li>
                          ))}
                        </ul>
                        {projs.length > 0 && (
                          <>
                            <h3 className={cn(eyebrow, 'mt-5 mb-2')}>
                              {t('exp.projects')} ({projs.length})
                            </h3>
                            <ul className="grid gap-1 text-sm sm:grid-cols-2">
                              {projs.map((p) => (
                                <li key={p.slug}>
                                  <Link to={path(`/work/${p.slug}`)} className="text-primary hover:underline">
                                    {l(p.title)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        <h3 className={cn(eyebrow, 'mt-5 mb-2')}>{t('exp.stack')}</h3>
                        <StackChips items={r.stack.slice(0, 12)} className="pb-1" />
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={0.2} className="relative">
            <Dot />
            <Card className="py-3">
              <CardContent className="px-4">
                <EducationEntry />
              </CardContent>
            </Card>
          </Reveal>
        </ol>

      </div>
    </>
  );
}
