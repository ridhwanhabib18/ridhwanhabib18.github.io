import { useState } from 'react';
import { CertCard } from '@/components/CertCard';
import { IconTile } from '@/components/icons';
import { Seo } from '@/components/Seo';
import { graph, personLd } from '@/lib/jsonld';
import { CoreSkills, EducationEntry, SkillChips } from '@/components/Parts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';
import { Stats } from '@/components/Stats';
import { profile } from '@/content/profile';
import { eyebrow, h2, narrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

export function filterSkillGroups(query: string, category = '') {
  const term = query.trim().toLocaleLowerCase();
  const groups = category ? profile.stack.filter((group) => group.group.en === category) : profile.stack;
  if (!term) return groups;

  return groups
    .map((group) => {
      const matchesGroup = `${group.group.en} ${group.group.id}`.toLocaleLowerCase().includes(term);
      return {
        ...group,
        items: matchesGroup ? group.items : group.items.filter((item) => item.toLocaleLowerCase().includes(term)),
      };
    })
    .filter((group) => group.items.length > 0);
}

export default function About() {
  const { t, l } = useI18n();
  const paras = l(profile.about);
  const [skillQuery, setSkillQuery] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const filteredSkills = filterSkillGroups(skillQuery, skillCategory);
  return (
    <>
      <Seo title={t('about.title')} description={paras[0]} jsonLd={graph(personLd())} />
      <div className={cn(narrow, 'py-12')}>
        <div className="stagger flex items-center gap-5">
          <img
            src={`${import.meta.env.BASE_URL}${profile.photo}`}
            alt={profile.name}
            width={96}
            height={96}
            className="size-20 shrink-0 rounded-full object-cover ring-2 ring-primary/40 sm:size-24"
          />
          <h1 className="text-4xl font-extrabold sm:text-5xl">{t('about.title')}</h1>
        </div>
        <div className="reveal-items mt-6 space-y-4 text-lg text-muted-foreground">
          {paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 className="sr-only">{t('about.stats')}</h2>
        <Stats className="mt-8" />

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.how')}</h2>
        <ul className="reveal-items reveal-sides grid gap-4 sm:grid-cols-2">
          {profile.howIWork.map((h) => (
            <li key={h.title.en}>
              <Card className="h-full flex-row gap-3 px-5">
                <IconTile name={h.icon} />
                <div>
                  <h3 className="font-semibold">{l(h.title)}</h3>
                  <p className="text-sm text-muted-foreground">{l(h.body)}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.stack')}</h2>
        <CoreSkills className="mb-6" />
        <div role="group" aria-label={t('about.skillCategories')} className="mb-4 flex flex-wrap gap-2">
          {[{ en: '', label: t('about.skillAll'), count: profile.stack.reduce((n, g) => n + g.items.length, 0) }, ...profile.stack.map((g) => ({ en: g.group.en, label: l(g.group), count: g.items.length }))].map((c) => (
            <Button key={c.en || 'all'} type="button" size="sm" variant={skillCategory === c.en ? 'default' : 'outline'} aria-pressed={skillCategory === c.en} onClick={() => setSkillCategory(c.en)}>
              {c.label}
              <span className="font-mono text-xs opacity-80">{c.count}</span>
            </Button>
          ))}
        </div>
        <div className="mb-5 max-w-sm">
          <label htmlFor="skill-filter" className="sr-only">
            {t('about.skillFilter')}
          </label>
          <Input
            id="skill-filter"
            type="search"
            value={skillQuery}
            onChange={(event) => setSkillQuery(event.target.value)}
            placeholder={t('about.skillFilterPlaceholder')}
          />
        </div>
        <div className="reveal-items grid gap-6 sm:grid-cols-2">
          {filteredSkills.map((g) => (
            <div key={g.group.en}>
              <h3 className={cn(eyebrow, 'mb-2')}>{l(g.group)}</h3>
              <SkillChips items={g.items} />
            </div>
          ))}
        </div>
        {filteredSkills.length === 0 && <p className="text-sm text-muted-foreground">{t('about.noSkillsFound')}</p>}

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.certs')}</h2>
        <ul className="reveal-items grid gap-4">
          {profile.certifications.map((c) => (
            <li key={c.name}>
              <CertCard cert={c} />
            </li>
          ))}
        </ul>

        <h2 className={cn(h2, 'mt-12 mb-4')}>{t('about.education')}</h2>
        <EducationEntry variant="card" />
      </div>
    </>
  );
}
