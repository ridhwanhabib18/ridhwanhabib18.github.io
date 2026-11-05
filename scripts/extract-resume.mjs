// Regenerates src/content/resume.generated.json from resume/resume_us.typ.
// Runs before `npm run dev` and `npm run build`; a test fails if the committed file is stale.
import { readFileSync, writeFileSync } from 'node:fs';
import { extractResume } from './extract-resume-lib.mjs';

const SOURCE = 'resume/resume_us.typ';
const OUT = 'src/content/resume.generated.json';

const data = extractResume(readFileSync(SOURCE, 'utf8'));
writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`extract-resume: ${SOURCE} -> ${OUT} (${data.experience.length} roles, ${data.skills.length} skill groups, ${data.certifications.length} certifications)`);
