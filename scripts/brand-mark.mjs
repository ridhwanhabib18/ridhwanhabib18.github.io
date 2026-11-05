// The site mark: the owner's initials written like a code tag, <RH/> (or <R/>).
// Drawn as strokes (not font text), so it looks identical in the header, the favicon, the app icons and the share cards.
// To switch between <RH/> and <R/>, change MARK below and run `npm run icons`.

export const MARK = 'RH'; // 'RH' or 'R'
export const STROKE = 3.2;
export const HEIGHT = 32;

// Each glyph is a stroked path inside a 32-unit-high box (letters are 20 tall, brackets 16, centred).
const BRACKET_OPEN = (x) => `M${x + 7} 8 L${x} 16 L${x + 7} 24`;
const BRACKET_CLOSE = (x) => `M${x} 8 L${x + 7} 16 L${x} 24`;
const SLASH = (x) => `M${x} 25 L${x + 5} 7`;
const LETTERS = {
  R: (x) => ({ d: `M${x} 26 V6 H${x + 6} A5 5 0 0 1 ${x + 6} 16 H${x} M${x + 5} 16 L${x + 11} 26`, w: 11 }),
  H: (x) => ({ d: `M${x} 6 V26 M${x + 10} 6 V26 M${x} 16 H${x + 10}`, w: 10 }),
};

/** Returns { d, width, height }: one SVG path (all strokes) and the size of the viewBox. */
export function markGeometry(text = MARK) {
  let x = 3;
  const parts = [BRACKET_OPEN(x)];
  x += 12; // bracket (7) + gap (5)
  for (const ch of text) {
    const g = LETTERS[ch](x);
    parts.push(g.d);
    x += g.w + 5;
  }
  parts.push(SLASH(x - 1));
  x += 8; // slash (5) + gap (3)
  parts.push(BRACKET_CLOSE(x));
  return { d: parts.join(' '), width: x + 7 + 3, height: HEIGHT };
}

/** A complete <svg> string; `size` is the rendered height in pixels. */
export function markSvg({ color = '#fff', size = 20, text = MARK } = {}) {
  const g = markGeometry(text);
  const w = (g.width / g.height) * size;
  return `<svg width="${w}" height="${size}" viewBox="0 0 ${g.width} ${g.height}" fill="none" stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${g.d}"/></svg>`;
}

/** An <svg> filling a square icon: coloured background plus the mark at `fraction` of the icon width. */
export function iconSvg({ size, fraction, background = '#26428b', color = '#fff', rounded = 0, text = MARK }) {
  const g = markGeometry(text);
  const markW = size * fraction;
  const markH = (g.height / g.width) * markW;
  const x = (size - markW) / 2;
  const y = (size - markH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${rounded * size}" fill="${background}"/><svg x="${x}" y="${y}" width="${markW}" height="${markH}" viewBox="0 0 ${g.width} ${g.height}" fill="none" stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round"><path d="${g.d}"/></svg></svg>`;
}
