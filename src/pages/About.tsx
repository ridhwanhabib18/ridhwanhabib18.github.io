import { ExternalLink } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { StackChips } from '@/components/Parts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { eyebrow, h2, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

export default function About() {
  const { t, l } = useI18n();
  const paras = l(profile.about);
  return (
    <>
      <Seo title={t('about.title')} description={paras[0]} />
      <div className={cn(narrow, 'py-12')}>
        <div className="flex items-center gap-5">
          <img
            src={`${import.meta.env.BASE_URL}${profile.photo}`}
            alt={profile.name}
            width={96}
            height={96}
            className="size-20 shrink-0 rounded-full object-cover ring-2 ring-primary/40 sm:size-24"
          />
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('about.title')}</h1>
        </div>
        <div className="mt-6 space-y-4 text-lg text-muted-foreground">
          {paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.how')}</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {profile.howIWork.map((h) => (
            <Card key={h.title.en} className="gap-1">
              <CardContent>
                <dt className="font-semibold">{l(h.title)}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{l(h.body)}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.stack')}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {profile.stack.map((g) => (
            <div key={g.group.en}>
              <h3 className={cn(eyebrow, 'mb-2')}>{l(g.group)}</h3>
              <StackChips items={g.items} />
            </div>
          ))}
        </div>

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.certs')}</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {profile.certifications.map((c) => (
            <li key={c.name}>
              <Card className="h-full">
                <CardContent className="flex flex-col items-start gap-2">
                  {c.level && <Badge variant="secondary">{l(c.level)}</Badge>}
                  <strong>{c.name}</strong>
                  {c.issuer && <span className="text-sm text-muted-foreground">{c.issuer}</span>}
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    {t('home.verify')}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.education')}</h2>
        <p>
          <strong>{profile.education.school}</strong>
          <br />
          <span className="text-muted-foreground">
            {l(profile.education.degree)} · {profile.education.period} · GPA {profile.education.gpa}
          </span>
        </p>
      </div>
    </>
  );
}
