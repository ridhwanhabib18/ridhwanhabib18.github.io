import type { CSSProperties } from 'react';
import { Link } from '@/components/TransitionLink';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useI18n } from '@/i18n';
import { profile } from '@/content/profile';
import { AppIcon } from '@/components/icons';
import type { DiagramDef, Metric, Project } from '@/content/types';
import type { PersonalProject } from '@/content/personal-projects';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { container, h2 } from '@/lib/ui';
import type { ReactNode } from 'react';

export function Section({ id, title, lead, action, children, className }: { id: string; title: string; lead?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('py-12 sm:py-14', className)} aria-labelledby={id}>
      <div className={container}>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id={id} className={h2}>
              {title}
            </h2>
            {lead && <p className="mt-2 max-w-2xl text-muted-foreground">{lead}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

export function MetricBadge({ type }: { type: Metric['type'] }) {
  const { t } = useI18n();
  return (
    <Badge variant={type === 'actual' ? 'success' : 'warning'}>
      <AppIcon name={type === 'actual' ? 'check' : 'target'} />
      {t(`badge.${type}`)}
    </Badge>
  );
}

export function MetricRow({ m }: { m: Metric }) {
  const { l } = useI18n();
  return (
    <li className="flex flex-wrap items-start gap-x-3 gap-y-1">
      <MetricBadge type={m.type} />
      <span>
        <strong>{l(m.value)}</strong> <span className="text-muted-foreground">· {l(m.label)}</span>
      </span>
    </li>
  );
}

export function StackChips({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((s) => (
        <li key={s}>
          <Badge variant="secondary" className="font-mono text-[0.7rem] font-normal whitespace-normal text-left">
            {s}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  const { t, l, path } = useI18n();
  const lead = p.metrics[0];
  return (
    <Card className="lift group relative h-full gap-3">
      <CardHeader className="flex-row items-center justify-between">
        <Badge variant={p.kind === 'delivered' ? 'default' : 'outline'}>
          <AppIcon name={p.kind === 'delivered' ? 'delivered' : 'contributed'} />
          {t(`badge.${p.kind}`)}
        </Badge>
        {p.year && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <AppIcon name="calendar" className="size-3.5" />
            {p.year}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <h3 className="text-lg leading-snug font-semibold">
          <Link to={path(`/work/${p.slug}`)} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-[3px] focus-visible:after:ring-ring/60">
            {l(p.title)}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{l(p.summary)}</p>
        <p className="text-xs font-medium text-muted-foreground">{`${t('card.role')}: ${l(p.role)}`}</p>
        {lead ? (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <MetricBadge type={lead.type} />
            <strong>{l(lead.value)}</strong>
            <span className="text-muted-foreground">· {l(lead.label)}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{l(p.role)}</p>
        )}
        <StackChips items={p.stack.slice(0, 4)} className="mt-auto pt-1" />
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary" aria-hidden="true">
          {t('cta.readCase')}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </CardContent>
    </Card>
  );
}

const COL_W = 230;
const ROW_H = 84;
const BOX_W = 196;
const BOX_H = 44;

const nodeKind = {
  client: 'fill-primary/10 stroke-primary',
  data: 'fill-success/10 stroke-success',
  external: 'fill-warning/10 stroke-warning',
  service: 'fill-secondary stroke-border',
} as const;

const chipKind = {
  client: 'border-primary/60 bg-primary/10',
  data: 'border-success/60 bg-success/10',
  external: 'border-warning/60 bg-warning/10',
  service: 'border-border bg-secondary',
} as const;

/** Phone-sized view of the diagram: a list of connections instead of a sideways-scrolling picture. Kept for screen readers on larger screens. */
function DiagramList({ def, title }: { def: DiagramDef; title: string }) {
  const node = (id: string) => def.nodes.find((n) => n.id === id)!;
  const chip = (id: string) => {
    const n = node(id);
    return <span className={cn('rounded-md border px-2 py-0.5 text-xs font-medium break-words', chipKind[n.kind ?? 'service'])}>{n.label}</span>;
  };
  return (
    <div className="sm:sr-only">
      <ul aria-label={title} className="space-y-2.5 rounded-xl border bg-card p-4">
        {def.edges.map((e, i) => (
          <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {chip(e.from)}
            <span aria-hidden="true" className="text-muted-foreground">
              →
            </span>
            {chip(e.to)}
            {e.label && <span className="font-mono text-xs text-muted-foreground">({e.label})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Themable, generic architecture diagram drawn from data. */
export function Diagram({ def, title }: { def: DiagramDef; title: string }) {
  const maxCol = Math.max(...def.nodes.map((n) => n.col));
  const maxRow = Math.max(...def.nodes.map((n) => n.row));
  const width = (maxCol + 1) * COL_W;
  const height = (maxRow + 1) * ROW_H + 8;
  const pos = (id: string) => {
    const n = def.nodes.find((x) => x.id === id)!;
    return { x: n.col * COL_W + (COL_W - BOX_W) / 2, y: n.row * ROW_H + 8 };
  };
  return (
    <>
      <DiagramList def={def} title={title} />
      <figure className="diagram-figure hidden overflow-x-auto rounded-xl border bg-card p-4 sm:block">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} width="100%" className="h-auto min-w-[34rem]">
        {def.edges.map((e, i) => {
          const a = pos(e.from);
          const b = pos(e.to);
          const ax = a.x + BOX_W / 2;
          const ay = a.y + BOX_H / 2;
          const bx = b.x + BOX_W / 2;
          const by = b.y + BOX_H / 2;
          const dx = bx - ax;
          const dy = by - ay;
          const horizontal = Math.abs(dx) >= Math.abs(dy);
          const sx = horizontal ? ax + Math.sign(dx) * (BOX_W / 2) : ax;
          const sy = horizontal ? ay : ay + Math.sign(dy) * (BOX_H / 2);
          const ex = horizontal ? bx - Math.sign(dx) * (BOX_W / 2) : bx;
          const ey = horizontal ? by : by - Math.sign(dy) * (BOX_H / 2);
          // arrow head as a plain triangle (not an SVG marker) so it can appear after its line has been drawn
          const len = Math.hypot(ex - sx, ey - sy) || 1;
          const ux = (ex - sx) / len;
          const uy = (ey - sy) / len;
          const tip = `${ex},${ey} ${ex - ux * 9 - uy * 4.5},${ey - uy * 9 + ux * 4.5} ${ex - ux * 9 + uy * 4.5},${ey - uy * 9 - ux * 4.5}`;
          // each connection is drawn in turn as the figure scrolls into view (see .diagram-edge in globals.css)
          const start = (i * 30) / def.edges.length;
          const edgeTiming = { '--s': `${start}%`, '--e': `${start + 15}%` } as CSSProperties;
          return (
            <g key={i} className="diagram-edge" style={edgeTiming}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} pathLength={1} className="stroke-muted-foreground/70" strokeWidth="1.5" />
              <polygon points={tip} className="diagram-tip fill-muted-foreground/70" />
              {e.label && (
                <text x={(sx + ex) / 2} y={(sy + ey) / 2 - 5} textAnchor="middle" className="fill-muted-foreground stroke-card font-mono text-[10px] [paint-order:stroke]" strokeWidth="5" strokeLinejoin="round">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {def.nodes.map((n) => {
          const p = pos(n.id);
          return (
            <g key={n.id} className="diagram-node">
              <rect x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx="8" strokeWidth="1.5" className={nodeKind[n.kind ?? 'service']} />
              <text x={p.x + BOX_W / 2} y={p.y + BOX_H / 2 + 4} textAnchor="middle" className="fill-foreground text-xs font-semibold">
                {n.label.length > 30 ? `${n.label.slice(0, 29)}…` : n.label}
              </text>
              <title>{n.label}</title>
            </g>
          );
        })}
      </svg>
      </figure>
    </>
  );
}

/** A personal project on the Projects page: a summary that opens the project's own page, like a professional case study. */
export function PersonalProjectCard({ p }: { p: PersonalProject }) {
  const { t, l, path } = useI18n();
  return (
    <Card className="lift group relative h-full gap-3">
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            <AppIcon name="user" />
            {t('badge.personal')}
          </Badge>
          <Badge variant={p.state === 'done' ? 'success' : 'warning'}>
            <AppIcon name={p.state === 'done' ? 'check' : 'progress'} />
            {t(`state.${p.state}`)}
          </Badge>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <AppIcon name="calendar" className="size-3.5" />
          {p.year}
        </span>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <h3 className="text-lg leading-snug font-semibold">
          <Link to={path(`/work/${p.slug}`)} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-[3px] focus-visible:after:ring-ring/60">
            {l(p.title)}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{l(p.summary)}</p>
        <p className="text-sm">{l(p.status)}</p>
        <p className="text-xs font-medium text-muted-foreground">{`${t('card.role')}: ${l(p.role)}`}</p>
        <StackChips items={p.cardStack} className="mt-auto pt-1" />
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary" aria-hidden="true">
          {t('cta.readProject')}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </CardContent>
    </Card>
  );
}

/**
 * The education entry, with the university emblem on a light tile (the emblem is dark blue, so it needs one on the dark theme).
 * `compact` is one short block for the Experience timeline; `card` matches the certification cards on About.
 */
export function EducationEntry({ variant = 'compact', className }: { variant?: 'compact' | 'card'; className?: string }) {
  const { l, t } = useI18n();
  const e = profile.education;
  const logo = (box: string, img: string, px: number) => (
    <span className={cn('flex shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-border', box)}>
      <img src={`${import.meta.env.BASE_URL}${e.logo}`} alt="" width={px} height={px} loading="lazy" decoding="async" className={img} />
    </span>
  );

  if (variant === 'card') {
    return (
      <Card className={cn('lift', className)}>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="self-center sm:self-start">{logo('size-28 p-2', 'size-24', 96)}</span>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            <h3 className="text-lg leading-snug font-semibold">{e.school}</h3>
            <p className="font-medium text-primary">{l(e.degree)}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted-foreground">{t('edu.period')}</dt>
              <dd>{e.period}</dd>
              <dt className="text-muted-foreground">{t('edu.location')}</dt>
              <dd>{e.location}</dd>
              <dt className="text-muted-foreground">{t('edu.gpa')}</dt>
              <dd>{e.gpa}</dd>
            </dl>
            <a
              href={e.thesisUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t('edu.thesis')}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {logo('size-12 p-1', 'size-10', 40)}
      <div className="min-w-0">
        <h3 className="leading-snug font-semibold">{e.school}</h3>
        <p className="text-sm font-medium text-primary">{l(e.degree)}</p>
        <p className="text-xs text-muted-foreground">{`${e.period} · ${e.location} · ${t('edu.gpa')} ${e.gpa}`}</p>
      </div>
    </div>
  );
}
