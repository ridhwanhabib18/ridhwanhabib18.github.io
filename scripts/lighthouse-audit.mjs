// Runs Lighthouse (Performance, Accessibility, Best Practices, SEO) on the built site and prints a table.
//   npm run build && npm run lighthouse
// Exits with an error if any score is below LH_MIN (default 90). Set LH_RUNS=3 to report the median of three runs per page. Scores vary a few points between runs, so a single
// low run is worth repeating before acting on it. Uses the installed Edge (Windows) or Chrome; override with CHROME_PATH.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LIGHTHOUSE = 'lighthouse@13.6.0';
const PORT = 4184;
const MIN = Number(process.env.LH_MIN ?? 90);
const RUNS = Math.max(1, Number(process.env.LH_RUNS ?? 1)); // use LH_RUNS=3 for a steadier result (slower)
const PAGES = ['/', '/work/', '/work/production-file-distribution/', '/experience/', '/about/', '/resume/', '/contact/', '/id/'];
const FORM_FACTORS = [['mobile', []], ['desktop', ['--preset=desktop']]];

const chromePath = process.env.CHROME_PATH ?? (process.platform === 'win32' ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' : undefined);
const env = { ...process.env, ...(chromePath ? { CHROME_PATH: chromePath } : {}) };

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { shell: true, stdio: 'ignore' });
const stop = () => {
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill();
};
process.on('exit', stop);

for (let i = 0; i < 30; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/`)).ok) break;
  } catch {
    /* not up yet */
  }
  await new Promise((r) => setTimeout(r, 500));
}

const dir = mkdtempSync(join(tmpdir(), 'lh-'));
const rows = [];
let worst = 100;

for (const [factor, extra] of FORM_FACTORS) {
  for (const path of PAGES) {
    // Each page is measured RUNS times and the median is reported: one run on a busy machine can be several points off.
    const runs = [];
    for (let n = 0; n < RUNS; n++) {
      const out = join(dir, `r.json`);
      const run = spawnSync('npx', ['--yes', LIGHTHOUSE, `http://localhost:${PORT}${path}`, '--quiet', '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new --no-sandbox', '--only-categories=performance,accessibility,best-practices,seo', ...extra], { shell: true, env, stdio: 'ignore' });
      if (run.status !== 0) {
        console.error(`lighthouse failed for ${path} (${factor})`);
        process.exit(2);
      }
      runs.push(JSON.parse(readFileSync(out, 'utf8')));
    }
    const scoreOf = (r, k) => Math.round((r.categories[k].score ?? 0) * 100);
    const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
    const s = Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo'].map((k) => [k, median(runs.map((r) => scoreOf(r, k)))]));
    const mid = [...runs].sort((a, b) => scoreOf(a, 'performance') - scoreOf(b, 'performance'))[Math.floor(runs.length / 2)];
    const text = (id) => mid.audits[id].displayValue.replace(/\s/g, ' ');
    worst = Math.min(worst, ...Object.values(s));
    rows.push({ factor, path, perf: s.performance, a11y: s.accessibility, bp: s['best-practices'], seo: s.seo, lcp: text('largest-contentful-paint'), cls: text('cumulative-layout-shift'), tbt: text('total-blocking-time') });
  }
}

rmSync(dir, { recursive: true, force: true });
console.log('\nfactor   page'.padEnd(52) + 'perf a11y  bp  seo   LCP      CLS    TBT');
for (const x of rows) console.log(`${x.factor.padEnd(8)} ${x.path.padEnd(42)}${String(x.perf).padStart(4)} ${String(x.a11y).padStart(4)} ${String(x.bp).padStart(4)} ${String(x.seo).padStart(4)}   ${x.lcp.padEnd(7)}  ${x.cls.padEnd(6)} ${x.tbt}`);
console.log(`\nlowest score: ${worst} (minimum allowed: ${MIN})`);
stop();
process.exit(worst < MIN ? 1 : 0);
