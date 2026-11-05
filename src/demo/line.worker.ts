/// <reference lib="webworker" />
import { initialLine, stepLine, type LineState } from './simulation';

let timer: ReturnType<typeof setInterval> | undefined;
let state: LineState = initialLine();

self.onmessage = (e: MessageEvent<'start' | 'stop'>) => {
  if (e.data === 'start' && timer === undefined) {
    state = initialLine();
    timer = setInterval(() => {
      const u = stepLine(state, Math.random);
      state = { produced: u.produced, target: u.target, adjustments: u.adjustments, tick: u.tick };
      self.postMessage(u);
    }, 1000);
  }
  if (e.data === 'stop' && timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
};
