import { Card } from '@/components/ui/card';
import { CountUp } from '@/components/CountUp';
import { IconTile, type IconName } from '@/components/icons';
import { useI18n } from '@/i18n';
import { personalProjects } from '@/content/personal-projects';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { cn } from '@/lib/utils';

/** Four headline figures, counted from the site data so they cannot drift from the projects and certifications shown. */
export function Stats({ className }: { className?: string }) {
  const { t } = useI18n();
  const stats: { icon: IconName; label: string; value: string }[] = [
    { icon: 'calendar', label: t('home.years'), value: profile.yearsExperience },
    { icon: 'delivered', label: t('stat.systems'), value: String(projects.filter((p) => p.kind === 'delivered').length) },
    { icon: 'rocket', label: t('stat.personal'), value: String(personalProjects.length) },
    { icon: 'award', label: t('stat.certs'), value: String(profile.certifications.length) },
  ];
  return (
    <ul className={cn('reveal-items grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4', className)}>
      {stats.map((s) => (
        <li key={s.label}>
          <Card className="group relative h-full flex-col items-start gap-3 overflow-hidden px-4 py-4 transition-colors hover:border-primary/60 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
            <div aria-hidden="true" className="pointer-events-none absolute -top-8 right-0 size-24 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] opacity-60 transition-opacity group-hover:opacity-100" />
            <IconTile name={s.icon} className="relative size-11 rounded-xl sm:size-12" />
            <p className="relative flex min-w-0 flex-col break-words">
              <strong className="text-gradient text-3xl leading-tight font-extrabold tabular-nums">
                <CountUp text={s.value} />
              </strong>
              <span className="text-sm leading-snug text-muted-foreground">{s.label}</span>
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
