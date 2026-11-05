// Compiles the three resume variants to public/resume/*.pdf with the Typst CLI.
// Used by CI before the site build, and locally via `npm run resume` (needs Typst: winget install Typst.Typst).
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const SOURCE = 'resume/main.typ';
const OUT_DIR = 'public/resume';
const ROLES = ['lead', 'senior', 'analyst'];

mkdirSync(OUT_DIR, { recursive: true });

for (const role of ROLES) {
  const out = `${OUT_DIR}/ridhwan-habib-resume-${role}.pdf`;
  const r = spawnSync('typst', ['compile', '--input', `role=${role}`, SOURCE, out], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.error || r.status !== 0) {
    console.error(
      r.error
        ? `resume: could not run "typst" (${r.error.message}). Install it first, for example: winget install Typst.Typst`
        : `resume: typst failed for role "${role}" (exit ${r.status})`,
    );
    process.exit(1);
  }
  console.log(`resume: wrote ${out}`);
}
