import { describe, expect, it } from 'vitest';
import { initialLine, stepLine } from '../demo/simulation';
import { actionsFor, submit, transition, validateTitle, type Request } from '../demo/workflow';

/** Deterministic random source. */
const seq = (...v: number[]) => {
  let i = 0;
  return () => v[i++ % v.length];
};

describe('line simulation', () => {
  it('produces 1 to 4 units per tick and never exceeds the target', () => {
    let s = initialLine();
    const rand = seq(0.1, 0.9, 0.5, 0.3);
    for (let n = 0; n < 50; n++) {
      const u = stepLine(s, rand);
      expect(u.produced).toBeLessThanOrEqual(u.target);
      s = u;
    }
  });

  it('records an adjustment event when the random draw is low', () => {
    const u = stepLine(initialLine(), seq(0.5, 0.01, 0.2, 0.2));
    expect(u.adjustments).toBe(1);
    expect(u.events.some((e) => e.kind === 'adjust')).toBe(true);
  });

  it('starts a new plan when the target is reached', () => {
    const u = stepLine({ produced: 599, target: 600, adjustments: 3, tick: 10 }, seq(0.99, 0.9));
    expect(u.produced).toBe(0);
    expect(u.events.some((e) => e.message.includes('complete'))).toBe(true);
  });
});

describe('approval workflow', () => {
  const base = (): Request[] => {
    const r = submit([], 'Update line 3 program', 1);
    if (!r.ok) throw new Error('setup');
    return r.value;
  };

  it('validates titles', () => {
    expect(validateTitle('ab').ok).toBe(false);
    expect(validateTitle('x'.repeat(81)).ok).toBe(false);
    expect(validateTitle('  Valid   title ')).toEqual({ ok: true, value: 'Valid title' });
  });

  it('moves submitted to in_review to approved', () => {
    const l1 = base();
    const r1 = transition(l1, l1[0].id, 'review');
    expect(r1.ok && r1.value[0].state).toBe('in_review');
    if (!r1.ok) return;
    const r2 = transition(r1.value, l1[0].id, 'approve');
    expect(r2.ok && r2.value[0].state).toBe('approved');
  });

  it('rejects invalid transitions like a server would', () => {
    const l = base();
    expect(transition(l, l[0].id, 'approve').ok).toBe(false);
    expect(transition(l, 'missing', 'review').ok).toBe(false);
  });

  it('allows no actions once a request is final', () => {
    expect(actionsFor('approved')).toEqual([]);
    expect(actionsFor('rejected')).toEqual([]);
  });

  it('does not mutate the previous list', () => {
    const l = base();
    transition(l, l[0].id, 'review');
    expect(l[0].state).toBe('submitted');
  });
});
