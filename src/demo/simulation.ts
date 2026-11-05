/** Synthetic production line. Pure and deterministic given a random source, so it is easy to test. */
export interface LineState {
  produced: number;
  target: number;
  adjustments: number;
  tick: number;
}

export interface LineEvent {
  kind: 'info' | 'adjust' | 'milestone';
  message: string;
}

export interface LineUpdate extends LineState {
  adjustRate: number;
  events: LineEvent[];
}

export const initialLine = (): LineState => ({ produced: 0, target: 600, adjustments: 0, tick: 0 });

export function stepLine(prev: LineState, rand: () => number): LineUpdate {
  const made = 1 + Math.floor(rand() * 4);
  const produced = Math.min(prev.target, prev.produced + made);
  const adjusted = rand() < 0.12;
  const adjustments = prev.adjustments + (adjusted ? 1 : 0);
  const tick = prev.tick + 1;
  const events: LineEvent[] = [];
  if (adjusted) events.push({ kind: 'adjust', message: `Station ${1 + Math.floor(rand() * 4)} adjustment` });
  const pct = (n: number) => Math.floor((n / prev.target) * 4);
  if (pct(produced) > pct(prev.produced)) {
    events.push({ kind: 'milestone', message: `${pct(produced) * 25}% of plan reached` });
  }
  if (tick === 1) events.push({ kind: 'info', message: 'Line started' });
  const state = produced >= prev.target ? initialLine() : { produced, target: prev.target, adjustments, tick };
  if (produced >= prev.target) events.push({ kind: 'info', message: 'Plan complete, new plan started' });
  const adjustRate = produced > 0 ? Math.round((adjustments / Math.max(1, Math.ceil(produced / 4))) * 100) : 0;
  return { ...state, adjustRate, events };
}
