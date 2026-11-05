// Reads the resume source (Typst) and returns the content the website needs.
// The Typst file is the single source of truth: the site never re-types this text.
// The phone number is deliberately never extracted (it must not be published on the web).

/** Typst escapes such as \# (C\#) become plain characters. */
const unescape = (s) => s.replace(/\\([#&$@*_`<>~%])/g, '$1').trim();

/** Split on commas that are not inside parentheses. */
function splitTopLevel(s) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function stringField(block, key) {
  const m = block.match(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  if (!m) throw new Error(`extract-resume: field "${key}" not found in:\n${block.slice(0, 200)}`);
  return unescape(m[1]);
}

function letString(text, name) {
  const m = text.match(new RegExp(`^#let ${name}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*$`, 'm'));
  if (!m) throw new Error(`extract-resume: #let ${name} not found`);
  return unescape(m[1]);
}

function sections(text) {
  const map = {};
  const parts = text.split(/^== (.+)$/m); // [preamble, name1, body1, name2, body2, ...]
  for (let i = 1; i < parts.length; i += 2) map[parts[i].trim()] = parts[i + 1];
  return map;
}

function parseBullet(line) {
  const body = line.replace(/^- /, '');
  const m = body.match(/^\*(.+?):\*\s+(.*)$/);
  return m ? { title: unescape(m[1]), text: unescape(m[2]) } : { text: unescape(body) };
}

/** Collect "#name(" ... ")" blocks (balanced parentheses) with their position. */
function callBlocks(text, name) {
  const blocks = [];
  const re = new RegExp(`#${name}\\(`, 'g');
  let m;
  while ((m = re.exec(text))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < text.length && depth > 0; i++) {
      if (text[i] === '(') depth++;
      else if (text[i] === ')') depth--;
    }
    blocks.push({ start: m.index, end: i, body: text.slice(m.index, i) });
  }
  return blocks;
}

function dates(block) {
  return { start: stringField(block, 'start-date'), end: stringField(block, 'end-date') };
}

export function extractResume(source) {
  // Drop whole-line comments (TODO notes etc.).
  const text = source
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');

  const sec = sections(text);

  const summariesBlock = text.match(/#let summaries = \(([\s\S]*?)\n\)/);
  if (!summariesBlock) throw new Error('extract-resume: summaries block not found');
  const summaries = {};
  for (const m of summariesBlock[1].matchAll(/(\w+):\s*"((?:[^"\\]|\\.)*)"/g)) summaries[m[1]] = unescape(m[2]);

  // Experience: each #work(...) is followed by its bullet lines until the next #work or section end.
  const expText = sec['Experience'] ?? '';
  const works = callBlocks(expText, 'work');
  const experience = works.map((w, i) => {
    const after = expText.slice(w.end, i + 1 < works.length ? works[i + 1].start : undefined);
    const seen = new Set();
    const bullets = [];
    for (const line of after.split(/\r?\n/)) {
      if (!line.startsWith('- ')) continue;
      if (seen.has(line)) continue; // the leadership bullet appears in two role-dependent places
      seen.add(line);
      bullets.push(parseBullet(line));
    }
    const d = dates(w.body);
    return {
      title: stringField(w.body, 'title'),
      company: stringField(w.body, 'company'),
      location: stringField(w.body, 'location'),
      start: d.start,
      end: d.end,
      bullets,
    };
  });

  const education = callBlocks(sec['Education'] ?? '', 'edu').map((e) => {
    const d = dates(e.body);
    return {
      institution: stringField(e.body, 'institution'),
      location: stringField(e.body, 'location'),
      start: d.start,
      end: d.end,
      degree: stringField(e.body, 'degree'),
    };
  });

  const skills = (sec['Skills'] ?? '')
    .split(/\r?\n/)
    .filter((l) => l.startsWith('- '))
    .map((l) => {
      const b = parseBullet(l);
      return { group: b.title ?? '', items: splitTopLevel(b.text).map(unescape) };
    });

  const certifications = (sec['Certifications'] ?? '')
    .split(/\r?\n/)
    .filter((l) => l.startsWith('- '))
    .map((l) => {
      const m = l.match(/^- (.*?),\s*#link\("([^"]+)"\)\[[^\]]*\]/);
      if (!m) throw new Error(`extract-resume: cannot parse certification line: ${l}`);
      return { name: unescape(m[1]), url: m[2] };
    });

  return {
    name: letString(text, 'name'),
    location: letString(text, 'location'),
    email: letString(text, 'email'),
    linkedin: letString(text, 'linkedin'),
    github: letString(text, 'github'),
    summaries,
    experience,
    education,
    skills,
    certifications,
  };
}
