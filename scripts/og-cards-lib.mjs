// HTML for the Open Graph share cards (1200x630). Pure and testable; scripts/og-images.mjs turns it into PNG files.

import { markSvg } from './brand-mark.mjs';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const titleSize = (card) => {
  const n = card.title.length;
  if (card.kind === 'home') return 56; // the name fits on one line
  if (card.kind === 'case') return n <= 24 ? 70 : n <= 44 ? 58 : n <= 66 ? 50 : 44;
  return n <= 24 ? 78 : n <= 44 ? 64 : n <= 66 ? 54 : 46;
};
const valueSize = (value) => (value.length <= 16 ? 36 : value.length <= 30 ? 29 : 25);

/**
 * card = { kind: 'home'|'case'|'page', title, description, kicker?, metrics: [{tone,badge,value,label}], chips: [], name, role, domain }
 * fonts = { inter: 'file:///...woff2', mono: 'file:///...woff2' }
 */
export function cardHtml(card, fonts) {
  const metrics = card.metrics
    .map(
      (m) => `
      <div class="metric">
        <span class="badge ${m.tone}">${escapeHtml(m.badge)}</span>
        <div class="value" style="font-size:${valueSize(m.value)}px">${escapeHtml(m.value)}</div>
        <div class="label">${escapeHtml(m.label)}</div>
      </div>`,
    )
    .join('');
  const chips = card.chips.map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<style>
  @font-face { font-family: 'OGInter'; src: url('${fonts.inter}') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'OGMono'; src: url('${fonts.mono}') format('woff2'); font-weight: 100 800; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${OG_WIDTH}px; height: ${OG_HEIGHT}px; overflow: hidden; }
  body {
    font-family: 'OGInter', sans-serif; color: #e8edf7; background: #0a0f1a;
    background-image: radial-gradient(900px 420px at 15% -10%, rgba(143,176,255,0.22), transparent 70%), radial-gradient(700px 360px at 100% 110%, rgba(143,176,255,0.12), transparent 70%);
    display: flex; flex-direction: column; justify-content: space-between; padding: 38px 64px 30px;
  }
  .top { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-shrink: 0; }
  .portrait { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(143,176,255,0.55); }
  .avatar { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; object-fit: cover; border: 2px solid rgba(143,176,255,0.55); }
  .kicker { display: inline-block; padding: 5px 16px; border-radius: 999px; background: rgba(143,176,255,0.16); color: #b7ccff; font-weight: 650; font-size: 22px; }
  .main { display: flex; flex-direction: column; gap: 16px; flex: 1; min-height: 0; justify-content: center; overflow: hidden; }
  h1 { font-weight: 800; letter-spacing: -0.02em; line-height: 1.08; font-size: ${titleSize(card)}px; }
  .desc { color: #a3afc4; font-size: 27px; line-height: 1.32; display: -webkit-box; -webkit-line-clamp: ${card.kind === 'page' ? 4 : 2}; -webkit-box-orient: vertical; overflow: hidden; max-width: 1020px; }
  .metrics { display: flex; gap: 18px; }
  .metric { flex: 1 1 0; min-width: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 14px 20px; display: flex; flex-direction: column; gap: 6px; }
  .badge { align-self: flex-start; padding: 2px 11px; border-radius: 999px; font-size: 17px; font-weight: 700; }
  .badge.actual { background: rgba(111,215,160,0.16); color: #6fd7a0; }
  .badge.target { background: rgba(242,193,102,0.16); color: #f2c166; }
  .value { font-weight: 800; line-height: 1.12; letter-spacing: -0.01em; }
  .label { color: #a3afc4; font-size: 19px; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; }
  .chip { font-family: 'OGMono', monospace; font-size: 19px; padding: 4px 13px; border-radius: 999px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: #e8edf7; }
  .foot { display: flex; align-items: center; justify-content: space-between; gap: 24px; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 16px; margin-top: 14px; flex-shrink: 0; }
  .id { display: flex; align-items: center; gap: 12px; font-size: 22px; white-space: nowrap; min-width: 0; flex: 1; }
  .id strong { font-weight: 700; }
  .id span { color: #a3afc4; overflow: hidden; text-overflow: ellipsis; }
  .mark { width: 38px; height: 38px; flex-shrink: 0; border-radius: 10px; background: #26428b; display: grid; place-items: center; }
  .domain { font-family: 'OGMono', monospace; font-size: 21px; color: #b7ccff; white-space: nowrap; flex-shrink: 0; }
</style></head>
<body>
  <div class="top">${card.kicker ? `<span class="kicker">${escapeHtml(card.kicker)}</span>` : '<span></span>'}${card.kind === 'home' && fonts.photo ? `<img class="portrait" src="${fonts.photo}" alt="" />` : ''}</div>
  <div class="main">
    <h1>${escapeHtml(card.title)}</h1>
    ${card.description ? `<p class="desc">${escapeHtml(card.description)}</p>` : ''}
    ${metrics ? `<div class="metrics">${metrics}</div>` : ''}
    ${chips ? `<div class="chips">${chips}</div>` : ''}
  </div>
  <div class="foot">
    <div class="id">
      ${fonts.photo ? `<img class="avatar" src="${fonts.photo}" alt="" />` : `<div class="mark">${markSvg({ size: 18 })}</div>`}
      <strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(card.role)}</span>
    </div>
    <div class="domain">${escapeHtml(card.domain)}</div>
  </div>
</body></html>`;
}
