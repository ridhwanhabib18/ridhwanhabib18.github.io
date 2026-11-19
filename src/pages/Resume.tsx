import { useState } from 'react';
import { Download } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/i18n';
import { resumePdfPath, resumeRegions, resumeVariants, type ResumeRegion } from '@/content/resume';
import { eyebrow, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

export default function Resume() {
  const { t, l } = useI18n();
  const base = import.meta.env.BASE_URL;
  const [region, setRegion] = useState<ResumeRegion>('us');
  const regionInfo = resumeRegions.find((r) => r.key === region)!;

  return (
    <>
      <Seo title={t('resume.title')} description={t('resume.lead')} />
      <div className={cn(narrow, 'py-12')}>
        <header className="stagger">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('resume.title')}</h1>
          <p className="mt-3 mb-8 text-lg text-muted-foreground">{t('resume.lead')}</p>
        </header>

        <div role="group" aria-labelledby="resume-region" className="mb-6">
          <p id="resume-region" className={cn(eyebrow, 'mb-2')}>
            {t('resume.region')}
          </p>
          <div className="flex flex-wrap gap-2">
            {resumeRegions.map((r) => (
              <Button key={r.key} type="button" size="sm" variant={r.key === region ? 'default' : 'outline'} aria-pressed={r.key === region} data-event={`resume-region-${r.key}`} onClick={() => setRegion(r.key)}>
                {l(r.label)}
              </Button>
            ))}
          </div>
        </div>

        <p className={cn(eyebrow, 'mb-2')}>{t('resume.role')}</p>
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
                    <>
                      <Button asChild>
                        <a href={`${base}${resumePdfPath(region, v.key)}`} download data-event={`resume-download-${region}-${v.key}`}>
                          <Download />
                          {t('cta.download')}
                        </a>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {l(regionInfo.label)}: {l(regionInfo.note)}
                      </p>
                    </>
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

        <section className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold">{t('resume.coverLetter')}</h2>
          <p className="mt-2 mb-4 text-muted-foreground">{t('resume.coverLetterLead')}</p>
          <Button asChild variant="outline">
            <a href={`${base}cover-letter.html`} target="_blank" rel="noopener noreferrer">
              {t('resume.openCoverLetter')}
            </a>
          </Button>
        </section>
      </div>
    </>
  );
}
