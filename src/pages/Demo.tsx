import { useEffect, useState, type ComponentType } from 'react';
import { Seo } from '@/components/Seo';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { container, eyebrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

// The interactive panels need a Web Worker and IndexedDB, so they are loaded on the client only.
// A plain effect (not React.lazy/Suspense) keeps the server HTML and the first client render identical.
function useDemoPanels(): ComponentType | null {
  const [Panels, setPanels] = useState<ComponentType | null>(null);
  useEffect(() => {
    let alive = true;
    import('./DemoPanels').then((m) => alive && setPanels(() => m.default));
    return () => {
      alive = false;
    };
  }, []);
  return Panels;
}

function Skeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-2" aria-busy="true">
      {[0, 1].map((i) => (
        <Card key={i} className="min-h-64">
          <CardHeader>
            <div className="h-5 w-48 animate-pulse-soft rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-24 animate-pulse-soft rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Demo() {
  const { t } = useI18n();
  const Panels = useDemoPanels();
  return (
    <>
      <Seo title={t('demo.title')} description={t('demo.lead')} />
      <div className={cn(container, 'py-12')}>
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('demo.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t('demo.lead')}</p>
        </header>
        {Panels ? <Panels /> : <Skeleton />}
        <section className="mt-8 rounded-xl border-l-4 border-primary bg-card p-5">
          <h2 className={cn(eyebrow, 'mb-2')}>{t('demo.howTitle')}</h2>
          <p>{t('demo.how')}</p>
        </section>
      </div>
    </>
  );
}
