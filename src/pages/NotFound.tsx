import { Link } from '@/components/TransitionLink';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { container } from '@/lib/ui';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const { t, path } = useI18n();
  return (
    <>
      <Seo title={t('notfound.title')} description={t('notfound.body')} />
      <div className={cn(container, 'py-24 text-center')}>
        <h1 className="text-4xl font-extrabold">{t('notfound.title')}</h1>
        <p className="mt-3 mb-8 text-lg text-muted-foreground">{t('notfound.body')}</p>
        <Button asChild>
          <Link to={path('/')}>{t('notfound.home')}</Link>
        </Button>
      </div>
    </>
  );
}
