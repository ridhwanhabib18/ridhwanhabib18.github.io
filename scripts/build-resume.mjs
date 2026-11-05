// Compiles the three resume variants to public/resume/*.pdf with the Typst CLI.
// Used by CI before the site build, and locally via `npm run resume` (needs Typst 0.14 or newer: winget install Typst.Typst).
// Output is PDF 2.0. To fall back to the widest-compatibility version, change PDF_VERSION to '1.7'.
import { spawnSync } from 'node:child_process';
import { mkdirSync, openSync, readSync, closeSync } from 'node:fs';

const SOURCE = 'resume/main.typ';
const OUT_DIR = 'public/resume';
const ROLES = ['lead', 'senior', 'analyst'];
const PDF_VERSION = '2.0';

function pdfHeader(file) {
  const fd = openSync(file, 'r');
  const buf = Buffer.alloc(8);
  readSync(fd, buf, 0, 8, 0);
  closeSync(fd);
  return buf.toString('latin1');
}

mkdirSync(OUT_DIR, { recursive: true });

for (const role of ROLES) {
  const out = `${OUT_DIR}/ridhwan-habib-resume-${role}.pdf`;
  const r = spawnSync('typst', ['compile', '--pdf-standard', PDF_VERSION, '--input', `role=${role}`, SOURCE, out], { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.error || r.status !== 0) {
    console.error(
      r.error
        ? `resume: could not run "typst" (${r.error.message}). Install it first, for example: winget install Typst.Typst`
        : `resume: typst failed for role "${role}" (exit ${r.status})`,
    );
    process.exit(1);
  }
  const header = pdfHeader(out);
  if (header !== `%PDF-${PDF_VERSION}`) {
    console.error(`resume: ${out} has header "${header}", expected "%PDF-${PDF_VERSION}"`);
    process.exit(1);
  }
  console.log(`resume: wrote ${out} (${header})`);
}
