import type { CSSProperties } from 'react';
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

/** "Oct 2026" / "Okt 2026". */
function formatMonth(iso: string, lang: string) {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * An industry certification with its Credly badge and the details shown on the badge page. `compact` is the short form
 * for the top of the home page (badge, name, level and validity on one line, verify link); the full card is on About.
 */
export function CertCard({ cert, compact = false }: { cert: Cert; compact?: boolean }) {
  const { t, l, lang } = useI18n();
  if (compact) {
    const meta = [cert.level ? l(cert.level) : '', cert.issued && cert.expires ? `${t('cert.valid')} ${formatMonth(cert.issued, lang)} – ${formatMonth(cert.expires, lang)}` : ''].filter(Boolean).join(' · ');
    return (
      <Card className="lift h-full py-3">
        <CardContent className="flex items-center gap-4 px-4">
          {cert.image && (
            <span className="cert-badge block size-16 shrink-0" style={{ '--badge': `url(${import.meta.env.BASE_URL}${cert.image})` } as CSSProperties}>
              <img src={`${import.meta.env.BASE_URL}${cert.image}`} alt={`${t('cert.badgeOf')} ${cert.name}`} width={64} height={64} loading="lazy" decoding="async" className="size-16" />
            </span>
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <strong className="leading-snug">{cert.name}</strong>
            {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {t('cert.verifyOnCredly')}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="lift h-full">
      <CardContent className="flex h-full flex-col gap-4 sm:flex-row sm:items-start">
        {cert.image && (
          <span className="cert-badge block size-28 shrink-0 self-center sm:self-start" style={{ '--badge': `url(${import.meta.env.BASE_URL}${cert.image})` } as CSSProperties}>
            <img src={`${import.meta.env.BASE_URL}${cert.image}`} alt={`${t('cert.badgeOf')} ${cert.name}`} width={112} height={112} loading="lazy" decoding="async" className="size-28" />
          </span>
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
