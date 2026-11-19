// Compiles the resume variants to public/resume/*.pdf with the Typst CLI: three regions (United States, Canada, Australia) times three roles.
// Used by CI before the site build, and locally via `npm run resume` (needs Typst 0.14 or newer: winget install Typst.Typst).
// public=true leaves the phone number and the work-authorization line out of the published PDFs.
// File names: US keeps ridhwan-habib-resume-<role>.pdf (links and bookmarks already point there); the others are ridhwan-habib-resume-<region>-<role>.pdf.
// Output is PDF 2.0. To fall back to the widest-compatibility version, change PDF_VERSION to '1.7'.
import { spawnSync } from 'node:child_process';
import { mkdirSync, openSync, readSync, closeSync } from 'node:fs';

const OUT_DIR = 'public/resume';
const REGIONS = [
  { key: 'us', source: 'resume/resume_us.typ', prefix: 'ridhwan-habib-resume' },
  { key: 'ca', source: 'resume/resume_ca.typ', prefix: 'ridhwan-habib-resume-ca' },
  { key: 'au', source: 'resume/resume_au.typ', prefix: 'ridhwan-habib-resume-au' },
];
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

for (const region of REGIONS) {
  for (const role of ROLES) {
    const out = `${OUT_DIR}/${region.prefix}-${role}.pdf`;
    const r = spawnSync('typst', ['compile', '--pdf-standard', PDF_VERSION, '--input', `role=${role}`, '--input', 'public=true', region.source, out], { stdio: 'inherit', shell: process.platform === 'win32' });
    if (r.error || r.status !== 0) {
      console.error(
        r.error
          ? `resume: could not run "typst" (${r.error.message}). Install it first, for example: winget install Typst.Typst`
          : `resume: typst failed for ${region.key} / role "${role}" (exit ${r.status})`,
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
}
