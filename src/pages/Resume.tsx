import { Download } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/i18n';
import { resumeVariants } from '@/content/resume';
import { eyebrow, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

export default function Resume() {
  const { t, l } = useI18n();
  const base = import.meta.env.BASE_URL;

  return (
    <>
      <Seo title={t('resume.title')} description={t('resume.lead')} />
      <div className={cn(narrow, 'py-12')}>
        <header className="stagger">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('resume.title')}</h1>
          <p className="mt-3 mb-8 text-lg text-muted-foreground">{t('resume.lead')}</p>
        </header>

        <Tabs defaultValue="lead">
          <TabsList aria-label={t('resume.title')} className="w-full justify-start sm:w-fit">
            {resumeVariants.map((v) => (
              <TabsTrigger key={v.key} value={v.key}>
                {l(v.label)}
              </TabsTrigger>
            ))}
          </TabsList>
          {resumeVariants.map((v) => (
            <TabsContent key={v.key} value={v.key}>
              <Card>
                <CardContent className="flex flex-col items-start gap-4">
                  <p className={eyebrow}>{l(v.target)}</p>
                  <p className="leading-relaxed">{l(v.summary)}</p>
                  {v.pdf ? (
                    <Button asChild>
                      <a href={`${base}${v.pdf}`} download>
                        <Download />
                        {t('cta.download')}
                      </a>
                    </Button>
                  ) : (
                    <>
                      <Button type="button" disabled aria-disabled="true">
                        <Download />
                        {t('cta.pdfSoon')}
                      </Button>
                      <p className="text-sm text-muted-foreground">{t('resume.pdfNote')}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}
