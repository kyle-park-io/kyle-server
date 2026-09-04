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

/*
  The blog's masthead and footer are copies of the SPA's, and copies drift.
  These read both files and require the rules that draw a line, set a colour
  or set a type size to agree. What went wrong before they existed: the 2px
  black rule under the wordmark and the gradient behind it were missing, the
  footer used a 1px hairline where the SPA uses a 2px bar and left off the
  grey ground entirely, nav items sat 20px apart instead of 32px, and the
  social icons were 18px instead of 20px.
*/
const headerCss = () =>
  readFileSync(
    join('..', 'blog-frontend', 'src', 'layout', 'Header.css'),
    'utf8',
  );
const footerCss = () =>
  readFileSync(
    join('..', 'blog-frontend', 'src', 'layout', 'Footer.css'),
    'utf8',
  );

/** Declarations of a rule, as a `prop: value` map, with the SPA's `--nyt-*`
 *  variables and the blog's `--shell-*` variables both resolved to the literal
 *  they stand for, so the two sides compare on rendered values. */
const rule = (css: string, selector: string, vars: Record<string, string>) => {
  const quoted = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Every rule for the selector, merged in source order the way the cascade
  // merges them. The SPA declares .nyt-header and .nyt-footer twice -- once
  // as a block of custom properties, once as the real rule -- so taking only
  // the first match read the token block and found none of the declarations
  // this test is about.
  const matches = [
    ...css.matchAll(new RegExp(`^${quoted}\\s*\\{([^}]*)\\}`, 'gm')),
  ];
  assert.ok(matches.length > 0, `expected a rule for ${selector}`);

  const out: Record<string, string> = {};
  for (const decl of matches.flatMap((m) => m[1].split(';'))) {
    const colon = decl.indexOf(':');
    if (colon === -1) continue;
    const prop = decl.slice(0, colon).trim();
    if (prop === '' || prop.startsWith('/*')) continue;
    let value = decl.slice(colon + 1).trim();
    for (const [name, literal] of Object.entries(vars)) {
      value = value.split(`var(${name})`).join(literal);
    }
    // Normalise whitespace, including inside function parens: prettier
    // wraps the SPA's linear-gradient() across lines and leaves the blog's
    // on one, which is not a difference in what renders.
    out[prop] = value
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/\s*,\s*/g, ', ');
  }
  return out;
};

const SPA_VARS = {
  '--nyt-color-black': '#121212',
  '--nyt-color-gray-dark': '#333333',
  '--nyt-color-gray-medium': '#666666',
  '--nyt-color-gray-light': '#f7f7f7',
  '--nyt-color-border': '#e2e2e2',
  '--nyt-color-white': '#ffffff',
  '--nyt-font-serif': "'Playfair Display', 'Georgia', 'Times New Roman', serif",
  '--nyt-font-sans': "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif",
  '--nyt-font-display': "'Cormorant Garamond', Pretendard, 'Georgia', serif",
  '--nyt-transition': '0.2s ease-in-out',
};

const BLOG_VARS = {
  '--shell-fg': '#121212',
  '--shell-fg-soft': '#333333',
  '--shell-muted': '#666666',
  '--shell-surface': '#f7f7f7',
  '--shell-rule': '#e2e2e2',
  '--shell-bg': '#ffffff',
  '--shell-serif': "'Playfair Display', 'Georgia', 'Times New Roman', serif",
  '--shell-sans': "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif",
  '--shell-display': "'Cormorant Garamond', Pretendard, 'Georgia', serif",
  '--shell-chrome-transition': '0.2s ease-in-out',
};

// The blog's font stacks carry Pretendard for Hangul, which the SPA's serif
// and sans stacks do not; compare the rest of the declaration.
const PAIRS: Array<[string, string, string[]]> = [
  ['.nyt-header', '.shell-header', ['background-color', 'border-bottom']],
  [
    '.nyt-header__utility-bar',
    '.shell-header__utility-bar',
    [
      'padding',
      'border-bottom',
      'font-size',
      'color',
      'text-transform',
      'letter-spacing',
    ],
  ],
  ['.nyt-header__home-icon', '.shell-header__home-icon', ['height', 'width']],
  [
    '.nyt-header__main',
    '.shell-header__main',
    ['padding', 'border-bottom', 'background'],
  ],
  [
    '.nyt-header__logo-accent',
    '.shell-header__logo-accent',
    [
      'font-family',
      'font-size',
      'font-weight',
      'color',
      'letter-spacing',
      'text-transform',
      'line-height',
    ],
  ],
  [
    '.nyt-header__logo-tagline',
    '.shell-header__logo-tagline',
    ['font-size', 'font-weight', 'font-style', 'color', 'letter-spacing'],
  ],
  ['.nyt-header__nav', '.shell-header__nav', ['padding', 'border-bottom']],
  [
    '.nyt-header__nav-list',
    '.shell-header__nav-list',
    ['gap', 'margin', 'padding'],
  ],
  [
    '.nyt-header__nav-link',
    '.shell-header__nav-link',
    [
      'font-size',
      'font-weight',
      'color',
      'text-transform',
      'letter-spacing',
      'padding',
    ],
  ],
  [
    '.nyt-header__nav-link::after',
    '.shell-header__nav-link::after',
    ['height', 'background-color'],
  ],
  [
    '.nyt-header__nav-link--devrel',
    '.shell-header__nav-link--devrel',
    ['color', 'font-weight'],
  ],
  [
    '.nyt-header__nav-link--quant',
    '.shell-header__nav-link--quant',
    ['color', 'font-weight'],
  ],
  [
    '.nyt-header__nav-link--personal-quant',
    '.shell-header__nav-link--personal-quant',
    ['color', 'font-weight'],
  ],
];

test('the blog masthead matches the SPA masthead rule for rule', () => {
  const spa = headerCss();
  const blog = shellCss();
  for (const [spaSel, blogSel, props] of PAIRS) {
    const a = rule(spa, spaSel, SPA_VARS);
    const b = rule(blog, blogSel, BLOG_VARS);
    for (const prop of props) {
      assert.equal(
        b[prop],
        a[prop],
        `${blogSel} { ${prop} } must match ${spaSel}`,
      );
    }
  }
});

const FOOTER_PAIRS: Array<[string, string, string[]]> = [
  ['.nyt-footer', '.shell-footer', ['width', 'background-color']],
  [
    '.nyt-footer__border-top',
    '.shell-footer__border-top',
    ['height', 'background-color'],
  ],
  [
    '.nyt-footer__content',
    '.shell-footer__content',
    [
      'padding',
      'padding-right',
      'max-width',
      'margin',
      'justify-content',
      'align-items',
    ],
  ],
  [
    '.nyt-footer__copyright-text',
    '.shell-footer__copyright-text',
    ['font-size', 'font-weight', 'color', 'text-transform', 'letter-spacing'],
  ],
  [
    '.nyt-footer__tagline-text',
    '.shell-footer__tagline-text',
    ['font-size', 'font-style', 'color', 'letter-spacing'],
  ],
  [
    '.nyt-footer__social',
    '.shell-footer__social',
    ['flex', 'justify-content', 'gap'],
  ],
  [
    '.nyt-footer__social-btn',
    '.shell-footer__social-btn',
    ['padding', 'border-radius'],
  ],
  [
    '.nyt-footer__social-icon',
    '.shell-footer__social-icon',
    ['height', 'width', 'object-fit', 'filter', 'opacity'],
  ],
];

test('the blog footer matches the SPA footer rule for rule', () => {
  const spa = footerCss();
  const blog = shellCss();
  for (const [spaSel, blogSel, props] of FOOTER_PAIRS) {
    const a = rule(spa, spaSel, SPA_VARS);
    const b = rule(blog, blogSel, BLOG_VARS);
    for (const prop of props) {
      assert.equal(
        b[prop],
        a[prop],
        `${blogSel} { ${prop} } must match ${spaSel}`,
      );
    }
  }
});

test('the footer carries every social link the SPA does', () => {
  // Telegram was missing and RSS was a text link, so the blog's footer showed
  // five icons and a word where the home page shows seven icons.
  const page = html();
  for (const href of [
    'kyle-park.notion.site',
    'medium.com',
    'linkedin.com/in/kyle-park-io',
    'github.com/kyle-park-io',
    't.me/kyleparkio',
    'x.com/bcd_kyle',
    '/blog/rss.xml',
  ]) {
    assert.ok(page.includes(href), `footer is missing ${href}`);
  }
});
