import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';

type Cert = (typeof profile.certifications)[number];

/** "8 October 2026" / "8 Oktober 2026"; UTC so the day never shifts with the reader's time zone. */
function formatDate(iso: string, lang: string) {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

/** An industry certification with its Credly badge and the details shown on the badge page. */
export function CertCard({ cert }: { cert: Cert }) {
  const { t, l, lang } = useI18n();
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 sm:flex-row sm:items-start">
        {cert.image && (
          <img
            src={`${import.meta.env.BASE_URL}${cert.image}`}
            alt={`${t('cert.badgeOf')} ${cert.name}`}
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            className="size-28 shrink-0 self-center sm:self-start"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          {cert.level && <Badge variant="secondary">{l(cert.level)}</Badge>}
          <strong className="text-lg leading-snug">{cert.name}</strong>
          {cert.issuer && <span className="text-sm text-muted-foreground">{t('cert.issuedBy')} {cert.issuer}</span>}
          {cert.summary && <p className="text-sm text-muted-foreground">{l(cert.summary)}</p>}
          {cert.issued && cert.expires && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted-foreground">{t('cert.issued')}</dt>
              <dd>{formatDate(cert.issued, lang)}</dd>
              <dt className="text-muted-foreground">{t('cert.validUntil')}</dt>
              <dd>{formatDate(cert.expires, lang)}</dd>
            </dl>
          )}
          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t('cert.verifyOnCredly')}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
