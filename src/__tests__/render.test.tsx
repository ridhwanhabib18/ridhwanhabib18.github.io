import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { projects } from '../content/projects';

const render = (url: string) =>
  renderToString(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );

const routes = ['/', '/work', '/experience', '/demo', '/about', '/resume', '/contact', ...projects.map((p) => `/work/${p.slug}`)];

describe('static render of every route', () => {
  for (const prefix of ['', '/id']) {
    for (const r of routes) {
      const url = `${prefix}${r === '/' ? '' : r}` || '/';
      it(`renders ${url}`, () => {
        const html = render(url);
        expect(html).toContain('<h1');
        expect(html).toContain(`lang="${prefix ? 'id' : 'en'}"`);
        expect(html).not.toContain('Page not found');
        expect(html).not.toContain('Halaman tidak ditemukan');
      });
    }
  }

  it('shows the not-found page for an unknown case study', () => {
    expect(render('/work/does-not-exist')).toContain('Page not found');
    expect(render('/id/work/does-not-exist')).toContain('Halaman tidak ditemukan');
  });

  it('labels results as Actual or Target on the home page', () => {
    const html = render('/');
    expect(html).toContain('Actual');
    expect(html).toContain('Target');
  });

  it('links the language switch to the same page in the other language', () => {
    expect(render('/work')).toContain('href="/id/work"');
    expect(render('/id/work')).toContain('href="/work"');
  });
});
