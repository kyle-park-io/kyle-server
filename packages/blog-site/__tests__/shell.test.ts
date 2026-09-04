import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const html = () => readFileSync(join(SERVE_ROOT, 'index.html'), 'utf8');

test('header renders every nav item as a real anchor', () => {
  const page = html();
  for (const href of [
    '/',
    '/blog',
    '/devrel',
    '/quant',
    '/personal-quant',
    '/profile',
  ]) {
    assert.match(
      page,
      new RegExp(`href="${href.replace(/\//g, '\\/')}"`),
      `missing link to ${href}`,
    );
  }
});

test('head carries canonical, description and OG tags', () => {
  const page = html();
  assert.match(
    page,
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog"/,
  );
  assert.match(page, /<meta name="description" content="[^"]+"/);
  assert.match(page, /<meta property="og:title" content="[^"]+"/);
  assert.match(page, /<meta property="og:type" content="website"/);
  assert.match(page, /<meta name="twitter:card" content="summary_large_image"/);
});

test('document language is declared', () => {
  assert.match(html(), /<html lang="ko"/);
});

/*
  The blog and the SolidJS home page are one site with two renderers, and
  their layout literals live in two files that nothing links together. They
  drifted: the blog's column was 992px wide with 16px of padding against the
  home page's 1100px with 24px, and the blog's body copy stayed at 16px while
  the home page's stepped up to 18px on a desktop. Both differences were
  plainly visible when crossing between the two.

  These tests read the SPA's own CSS and require the blog's to agree, so the
  next edit to either file has to change both.
*/
const spaCss = () =>
  readFileSync(join('..', 'blog-frontend', 'src', 'app', 'App.css'), 'utf8');
const spaGlobalCss = () =>
  readFileSync(join('..', 'blog-frontend', 'src', 'css', 'global.css'), 'utf8');
const shellCss = () => readFileSync(join('src', 'styles', 'shell.css'), 'utf8');
const tokensCss = () =>
  readFileSync(join('..', 'site-shell', 'src', 'styles', 'tokens.css'), 'utf8');

test('the blog column is the same width as the home page column', () => {
  const spaMax = spaCss().match(/--home-max-width:\s*([\dpx]+)/);
  assert.ok(spaMax, 'expected --home-max-width in the SPA home page CSS');

  const shellMax = tokensCss().match(/--shell-max:\s*([\dpx]+)/);
  assert.ok(shellMax, 'expected --shell-max in tokens.css');

  assert.equal(
    shellMax[1],
    spaMax[1],
    '--shell-max must track the SPA --home-max-width',
  );
});

test('the blog column has the same padding ladder as the home page container', () => {
  // .home-container steps its padding down twice (App.css:423 at 768px, :475
  // at 480px). Comparing only the base declaration would let the two ladders
  // diverge on a phone, so compare every step in order.
  const paddings = (css: string, selector: string) => {
    const quoted = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return [
      ...css.matchAll(
        new RegExp(`${quoted} \\{[^}]*?padding:\\s*([^;]+);`, 'g'),
      ),
    ].map((m) => m[1].trim());
  };

  const spa = paddings(spaCss(), '.home-container');
  const blog = paddings(shellCss(), '.shell-main');

  assert.ok(spa.length > 1, 'expected a .home-container padding ladder');
  assert.deepEqual(
    blog,
    spa,
    '.shell-main must step through the same padding values as .home-container',
  );
});

test('the blog body type resolves to the same size as the SPA at every width', () => {
  // The SPA restates the same size at several breakpoints (576 repeats the
  // base 16px, 1200 and 1400 repeat 992's 18px), so comparing the two ladders
  // declaration for declaration would fail on redundancy rather than on a
  // real difference. Resolve each ladder to a size at a set of widths and
  // compare those instead.
  const ladder = (css: string, selector: string) => {
    const quoted = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const base = css.match(
      new RegExp(`^${quoted} \\{[^}]*?font-size:\\s*(\\d+)px`, 'm'),
    );
    assert.ok(base, `expected a base font-size for ${selector}`);

    const steps = [
      ...css.matchAll(
        /@media \(min-width: (\d+)px\) \{\s*([^{]+)\{[^}]*?font-size:\s*(\d+)px/g,
      ),
    ]
      .filter((m) => m[2].trim() === selector)
      .map((m) => ({ at: Number(m[1]), size: Number(m[3]) }))
      .sort((a, b) => a.at - b.at);
    assert.ok(steps.length > 0, `expected a font-size ladder for ${selector}`);

    return (width: number) =>
      steps.reduce(
        (size, step) => (width >= step.at ? step.size : size),
        Number(base[1]),
      );
  };

  const spa = ladder(spaGlobalCss(), 'body');
  const blog = ladder(shellCss(), '.shell-body');
  const widths = [375, 600, 800, 1000, 1300, 1500];

  assert.deepEqual(
    widths.map(blog),
    widths.map(spa),
    'the blog body must render at the same size as the SPA body at every width',
  );
});
