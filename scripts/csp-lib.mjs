// Content Security Policy for the pre-rendered pages, delivered as a <meta> tag (GitHub Pages cannot set HTTP headers).
// Pure functions so they can be tested. Used by scripts/prerender.mjs.
import { createHash } from 'node:crypto';

/** sha256 source expressions for every inline, executable <script> in the page (data blocks such as JSON-LD are not executed). */
export function inlineScriptHashes(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/type\s*=\s*["']application\/ld\+json["']/.test(attrs)) continue;
    // Browsers hash the script text as parsed, and the HTML parser turns CRLF into LF; files built on Windows have CRLF.
    const text = m[2].replace(/\r\n?/g, '\n');
    out.push(`'sha256-${createHash('sha256').update(text).digest('base64')}'`);
  }
  return out;
}

/**
 * hashes: result of inlineScriptHashes. analyticsCode: GoatCounter site code, when visit statistics are enabled.
 * Only what the site really uses is allowed: its own files, inline styles (React sets style attributes) and data: images.
 */
export function buildCsp({ hashes = [], analyticsCode } = {}) {
  const analyticsScript = analyticsCode ? ['https://gc.zgo.at'] : [];
  const analyticsConnect = analyticsCode ? [`https://${analyticsCode}.goatcounter.com`] : [];
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", ...hashes, ...analyticsScript],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', ...analyticsConnect],
    'font-src': ["'self'", 'data:'], // the build inlines very small font files as data: URIs
    'connect-src': ["'self'", ...analyticsConnect],
    'worker-src': ["'self'"],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  };
  return Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(' ')}`)
    .join('; ');
}

/** Inserts the policy right after <meta charset>, so it applies to everything that follows. */
export function withCsp(html, csp) {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, '&quot;')}" />`;
  if (!/<meta charset="[^"]*"\s*\/?>/i.test(html)) throw new Error('csp: <meta charset> not found in the page');
  return html.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1\n    ${tag}`);
}
