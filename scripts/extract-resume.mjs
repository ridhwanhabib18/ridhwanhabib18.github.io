// Regenerates src/content/resume.generated.json from resume/resume_us.typ,
// and src/content/resume.regions.generated.json (the Canada and Australia summaries) from resume_ca.typ and resume_au.typ.
// Runs before `npm run dev` and `npm run build`; a test fails if a committed file is stale.
import { readFileSync, writeFileSync } from 'node:fs';
import { extractResume, extractSummaries } from './extract-resume-lib.mjs';

const SOURCE = 'resume/resume_us.typ';
const OUT = 'src/content/resume.generated.json';
const REGIONS_OUT = 'src/content/resume.regions.generated.json';

const data = extractResume(readFileSync(SOURCE, 'utf8'));
writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`extract-resume: ${SOURCE} -> ${OUT} (${data.experience.length} roles, ${data.skills.length} skill groups, ${data.certifications.length} certifications)`);

const regions = Object.fromEntries(['ca', 'au'].map((r) => [r, extractSummaries(readFileSync(`resume/resume_${r}.typ`, 'utf8'))]));
writeFileSync(REGIONS_OUT, `${JSON.stringify(regions, null, 2)}\n`);
console.log(`extract-resume: resume/resume_ca.typ, resume/resume_au.typ -> ${REGIONS_OUT}`);
