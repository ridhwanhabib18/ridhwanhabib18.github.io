import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { HeadCtx, type HeadData } from './components/Seo';
import { projects } from './content/projects';

/** Render one route to an HTML string plus its head metadata. Used only by scripts/prerender.mjs. */
export function render(url: string): { html: string; head: HeadData | undefined } {
  const collector: { data?: HeadData } = {};
  const html = renderToString(
    <HeadCtx.Provider value={collector}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadCtx.Provider>,
  );
  return { html, head: collector.data };
}

export { ogExtras } from './og';
export { translationRows } from './translations';

const pages = ['/', '/work', '/experience', '/demo', '/about', '/resume', '/contact', ...projects.map((p) => `/work/${p.slug}`)];

/** Every route to pre-render, in both languages. */
export const routes: string[] = pages.flatMap((p) => [p, p === '/' ? '/id' : `/id${p}`]);
