import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { DiagramDef, Metric, Project } from '@/content/types';
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
  return <Badge variant={type === 'actual' ? 'success' : 'warning'}>{t(`badge.${type}`)}</Badge>;
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
          <Badge variant="secondary" className="font-mono text-[0.7rem] font-normal">
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
    <Card className="group relative h-full gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 motion-reduce:hover:translate-y-0">
      <CardHeader className="flex-row items-center justify-between">
        <Badge variant={p.kind === 'delivered' ? 'default' : 'outline'}>{t(`badge.${p.kind}`)}</Badge>
        {p.year && <span className="text-xs text-muted-foreground">{p.year}</span>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <h3 className="text-lg leading-snug font-semibold">
          <Link to={path(`/work/${p.slug}`)} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-[3px] focus-visible:after:ring-ring/60">
            {l(p.title)}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{l(p.summary)}</p>
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
    <figure className="overflow-x-auto rounded-xl border bg-card p-4">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} width="100%" className="h-auto min-w-[34rem]">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" className="fill-muted-foreground" />
          </marker>
        </defs>
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
          return (
            <g key={i}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} className="stroke-muted-foreground/70" strokeWidth="1.5" markerEnd="url(#arrow)" />
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
            <g key={n.id}>
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
  );
}
