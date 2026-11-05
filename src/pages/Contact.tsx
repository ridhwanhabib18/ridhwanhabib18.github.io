import { Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons';
import { CopyButton } from '@/components/CopyButton';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { eyebrow, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

function Item({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <Card className="h-full gap-1">
      <CardContent className="flex items-start gap-3">
        <span className="mt-0.5 text-primary" aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <p className={eyebrow}>{label}</p>
          <p className="mt-1 break-words">{children}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Contact() {
  const { t, l } = useI18n();
  const subject = encodeURIComponent('Hello from your portfolio');
  const mail = `mailto:${profile.email}?subject=${subject}`;
  const link = 'font-medium text-primary hover:underline';
  return (
    <>
      <Seo title={t('contact.title')} description={t('contact.lead')} />
      <div className={cn(narrow, 'py-12')}>
        <h1 className="text-4xl font-extrabold sm:text-5xl">{t('contact.title')}</h1>
        <p className="mt-3 mb-8 text-lg text-muted-foreground">{t('contact.lead')}</p>

        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <Item icon={<Mail className="size-5" />} label={t('contact.email')}>
              <span className="flex flex-wrap items-center gap-2">
                <a className={link} href={mail} data-event="email-click">
                  {profile.email}
                </a>
                <CopyButton value={profile.email} />
              </span>
            </Item>
          </li>
          <li>
            <Item icon={<LinkedinIcon className="size-5" />} label={t('contact.linkedin')}>
              <a className={link} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                {profile.linkedinText}
              </a>
            </Item>
          </li>
          <li>
            <Item icon={<GithubIcon className="size-5" />} label={t('contact.github')}>
              <a className={link} href={profile.github} target="_blank" rel="noopener noreferrer">
                {profile.githubText}
              </a>
            </Item>
          </li>
          <li>
            <Item icon={<MapPin className="size-5" />} label={t('contact.location')}>
              {l(profile.location)}
            </Item>
          </li>
        </ul>

        <Button asChild size="lg" className="mt-8">
          <a href={mail}>
            <Mail />
            {t('contact.cta')}
          </a>
        </Button>
      </div>
    </>
  );
}
