/**
 * Optional, cookie-free visit statistics with GoatCounter (https://www.goatcounter.com).
 * OFF by default: nothing is loaded and nothing is sent unless the site is built with VITE_GOATCOUNTER_CODE set
 * (the GitHub Actions variable GOATCOUNTER_CODE). It also stays off for visitors who send Do Not Track.
 *
 * What it records: page views and clicks on elements marked with data-event (resume download, email click and copy).
 * No cookies, no personal data, no cross-site tracking.
 */

interface GoatCounter {
  count: (vars: { path: string; title?: string; event?: boolean }) => void;
}
declare global {
  interface Window {
    goatcounter?: GoatCounter & { no_onload?: boolean };
  }
}

const code = import.meta.env.VITE_GOATCOUNTER_CODE as string | undefined;

/** True when this build records visit statistics (used to show a privacy note). */
export const analyticsEnabled = Boolean(code);

const queue: (() => void)[] = [];
let ready = false;

function run(job: () => void) {
  if (!analyticsEnabled) return;
  if (ready) job();
  else queue.push(job);
}

export function trackPage(path: string, title?: string) {
  run(() => window.goatcounter?.count({ path, title }));
}

export function trackEvent(name: string) {
  run(() => window.goatcounter?.count({ path: `event/${name}`, title: name, event: true }));
}

export function initAnalytics() {
  if (!code || typeof window === 'undefined') return;
  if (navigator.doNotTrack === '1') return;

  // Page views are counted by the router (the site is a single-page app), so the script must not count on load.
  window.goatcounter = { no_onload: true } as GoatCounter & { no_onload: boolean };
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  script.onload = () => {
    ready = true;
    queue.splice(0).forEach((job) => job());
  };
  document.head.appendChild(script);

  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest?.('[data-event]');
      const name = el?.getAttribute('data-event');
      if (name) trackEvent(name);
    },
    true,
  );
}
