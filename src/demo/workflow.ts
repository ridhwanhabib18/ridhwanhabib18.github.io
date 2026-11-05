export type State = 'submitted' | 'in_review' | 'approved' | 'rejected';
export type Action = 'review' | 'approve' | 'reject';

export interface Request {
  id: string;
  title: string;
  state: State;
  createdAt: number;
}

const ALLOWED: Record<State, Partial<Record<Action, State>>> = {
  submitted: { review: 'in_review', reject: 'rejected' },
  in_review: { approve: 'approved', reject: 'rejected' },
  approved: {},
  rejected: {},
};

export const actionsFor = (s: State): Action[] => Object.keys(ALLOWED[s]) as Action[];

export type Result<T> = { ok: true; value: T } | { ok: false; error: 'title' | 'transition' };

export function validateTitle(raw: string): Result<string> {
  const title = raw.trim().replace(/\s+/g, ' ');
  return title.length >= 3 && title.length <= 80 ? { ok: true, value: title } : { ok: false, error: 'title' };
}

export function submit(list: Request[], rawTitle: string, now = Date.now()): Result<Request[]> {
  const v = validateTitle(rawTitle);
  if (!v.ok) return v;
  const req: Request = { id: `${now.toString(36)}${list.length}`, title: v.value, state: 'submitted', createdAt: now };
  return { ok: true, value: [req, ...list] };
}

export function transition(list: Request[], id: string, action: Action): Result<Request[]> {
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false, error: 'transition' };
  const next = ALLOWED[list[idx].state][action];
  if (!next) return { ok: false, error: 'transition' };
  const copy = list.slice();
  copy[idx] = { ...list[idx], state: next };
  return { ok: true, value: copy };
}

/* ---- persistence: IndexedDB with an in-memory fallback ---- */

const DB = 'portfolio-demo';
const STORE = 'kv';
const KEY = 'requests';
let memory: Request[] = [];

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexedDB'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function load(): Promise<{ list: Request[]; persistent: boolean }> {
  try {
    const db = await open();
    return await new Promise((resolve, reject) => {
      const r = db.transaction(STORE).objectStore(STORE).get(KEY);
      r.onsuccess = () => resolve({ list: (r.result as Request[] | undefined) ?? [], persistent: true });
      r.onerror = () => reject(r.error);
    });
  } catch {
    return { list: memory, persistent: false };
  }
}

export async function save(list: Request[]): Promise<boolean> {
  memory = list;
  try {
    const db = await open();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(list, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}
