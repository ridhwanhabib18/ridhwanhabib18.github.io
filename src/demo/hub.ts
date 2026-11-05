import type { LineUpdate } from './simulation';

export type HubStatus = 'disconnected' | 'connecting' | 'connected';

/**
 * Hub-shaped client. The surface (status, on, start, stop) mirrors what a SignalR
 * HubConnection exposes, so UI code written against it carries over to a real hub.
 * The transport here is a Web Worker because GitHub Pages cannot host a server.
 */
export interface LineHub {
  onStatus(cb: (s: HubStatus) => void): () => void;
  onUpdate(cb: (u: LineUpdate) => void): () => void;
  start(): void;
  stop(): void;
}

export function createLineHub(): LineHub {
  const statusCbs = new Set<(s: HubStatus) => void>();
  const updateCbs = new Set<(u: LineUpdate) => void>();
  let worker: Worker | null = null;
  const setStatus = (s: HubStatus) => statusCbs.forEach((cb) => cb(s));

  return {
    onStatus(cb) {
      statusCbs.add(cb);
      return () => statusCbs.delete(cb);
    },
    onUpdate(cb) {
      updateCbs.add(cb);
      return () => updateCbs.delete(cb);
    },
    start() {
      if (worker) return;
      setStatus('connecting');
      worker = new Worker(new URL('./line.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e: MessageEvent<LineUpdate>) => updateCbs.forEach((cb) => cb(e.data));
      worker.onerror = () => {
        worker?.terminate();
        worker = null;
        setStatus('disconnected');
      };
      worker.postMessage('start');
      // A real connection handshake takes a moment; keep the status honest and visible.
      setTimeout(() => worker && setStatus('connected'), 400);
    },
    stop() {
      worker?.postMessage('stop');
      worker?.terminate();
      worker = null;
      setStatus('disconnected');
    },
  };
}
