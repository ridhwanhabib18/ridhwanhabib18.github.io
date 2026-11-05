import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/i18n';
import { createLineHub, type HubStatus } from '@/demo/hub';
import type { LineEvent, LineUpdate } from '@/demo/simulation';
import { actionsFor, load, save, submit, transition, type Action, type Request, type State } from '@/demo/workflow';
import { eyebrow } from '@/lib/ui';
import { cn } from '@/lib/utils';

const ACTION_KEY: Record<Action, string> = { review: 'demo.review', approve: 'demo.approve', reject: 'demo.reject' };
const STATE_VARIANT: Record<State, 'secondary' | 'default' | 'success' | 'warning'> = { submitted: 'secondary', in_review: 'default', approved: 'success', rejected: 'warning' };
const EVENT_TONE: Record<LineEvent['kind'], string> = { info: 'text-foreground', adjust: 'text-warning', milestone: 'text-success' };

function Dashboard() {
  const { t } = useI18n();
  const hub = useMemo(() => createLineHub(), []);
  const [status, setStatus] = useState<HubStatus>('disconnected');
  const [data, setData] = useState<LineUpdate | null>(null);
  const [log, setLog] = useState<(LineEvent & { n: number })[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const offS = hub.onStatus(setStatus);
    const offU = hub.onUpdate((u) => {
      setData(u);
      if (u.events.length) setLog((prev) => [...u.events.map((e) => ({ ...e, n: counter.current++ })), ...prev].slice(0, 6));
    });
    return () => {
      offS();
      offU();
      hub.stop();
    };
  }, [hub]);

  const pct = data ? Math.round((data.produced / data.target) * 100) : 0;
  const statusLabel = status === 'connected' ? t('demo.connected') : status === 'connecting' ? t('demo.connecting') : t('demo.disconnected');

  return (
    <Card aria-labelledby="dash-h">
      <CardHeader>
        <CardTitle id="dash-h" className="text-lg">
          {t('demo.dashboard')}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
          <span className={cn('size-2.5 rounded-full', status === 'connected' ? 'bg-success' : status === 'connecting' ? 'bg-warning' : 'bg-muted-foreground')} aria-hidden="true" />
          <span>
            {t('demo.status')}: <strong role="status">{statusLabel}</strong>
          </span>
          {status === 'disconnected' ? (
            <Button type="button" size="sm" onClick={() => hub.start()}>
              {t('demo.start')}
            </Button>
          ) : (
            <Button type="button" size="sm" variant="outline" onClick={() => hub.stop()}>
              {t('demo.stop')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('demo.produced')}</p>
            <p className="font-mono text-2xl">{data ? `${data.produced} / ${data.target}` : '–'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('demo.adjust')}</p>
            <p className="font-mono text-2xl">{data ? `${data.adjustRate}%` : '–'}</p>
          </div>
        </div>
        <Progress value={pct} aria-label={t('demo.produced')} />
        <div>
          <h3 className={cn(eyebrow, 'mb-2')}>{t('demo.events')}</h3>
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('demo.noEvents')}</p>
          ) : (
            <ul className="space-y-1.5 font-mono text-xs" aria-live="polite">
              {log.map((e) => (
                <li key={e.n} className={cn('rounded-md bg-secondary px-2.5 py-1.5', EVENT_TONE[e.kind])}>
                  {e.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Workflow() {
  const { t } = useI18n();
  const [list, setList] = useState<Request[]>([]);
  const [persistent, setPersistent] = useState(true);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    load().then((r) => {
      if (!alive) return;
      setList(r.list);
      setPersistent(r.persistent);
    });
    return () => {
      alive = false;
    };
  }, []);

  const commit = useCallback(async (next: Request[]) => {
    setList(next);
    setPersistent(await save(next));
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = submit(list, title);
    if (!r.ok) return setError(t('demo.errTitle'));
    setError(null);
    setTitle('');
    void commit(r.value);
  };

  const act = (id: string, a: Action) => {
    const r = transition(list, id, a);
    if (!r.ok) return setError(t('demo.errTransition'));
    setError(null);
    void commit(r.value);
  };

  return (
    <Card aria-labelledby="wf-h">
      <CardHeader>
        <CardTitle id="wf-h" className="text-lg">
          {t('demo.workflow')}
        </CardTitle>
        <CardDescription>{t('demo.workflowLead')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!persistent && <p className="rounded-md bg-warning/15 px-3 py-2 text-sm text-warning">{t('demo.unavailable')}</p>}

        <form onSubmit={onSubmit} noValidate className="space-y-2">
          <Label htmlFor="wf-title">{t('demo.titleLabel')}</Label>
          <div className="flex gap-2">
            <Input id="wf-title" value={title} maxLength={80} placeholder={t('demo.titlePlaceholder')} aria-invalid={error ? true : undefined} aria-describedby={error ? 'wf-err' : undefined} onChange={(e) => setTitle(e.target.value)} />
            <Button type="submit">{t('demo.submit')}</Button>
          </div>
          {error && (
            <p id="wf-err" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('demo.empty')}</p>
        ) : (
          <ul className="space-y-2">
            {list.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <strong className="break-words">{r.title}</strong>
                  <Badge variant={STATE_VARIANT[r.state]}>{t(`demo.state.${r.state}`)}</Badge>
                </div>
                <div className="flex gap-2">
                  {actionsFor(r.state).map((a) => (
                    <Button key={a} type="button" size="sm" variant="outline" onClick={() => act(r.id, a)}>
                      {t(ACTION_KEY[a])}
                    </Button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
        {list.length > 0 && (
          <Button type="button" variant="link" className="h-auto p-0" onClick={() => void commit([])}>
            {t('demo.reset')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function DemoPanels() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Dashboard />
      <Workflow />
    </div>
  );
}
