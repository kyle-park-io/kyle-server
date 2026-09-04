import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The hast subset the wrapper-plugin fixtures below build by hand. */
interface TestNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: TestNode[];
}

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file: string) => readFileSync(join(SERVE_ROOT, file), 'utf8');

test('a post is emitted as an extension-less-servable html file', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'hello-world.html')));
  assert.ok(existsSync(join(SERVE_ROOT, 'second-post.html')));
});

test('the article carries its own canonical, OG type and language', () => {
  const page = read('hello-world.html');
  assert.match(
    page,
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/hello-world"/,
  );
  assert.match(page, /<meta property="og:type" content="article"/);
  assert.match(page, /<title>첫 번째 글/);
});

test('headings get ids and anchor links', () => {
  const page = read('hello-world.html');
  assert.match(page, /id="첫-번째-절"|id="[^"]+"[^>]*>\s*첫 번째 절/);
  assert.match(page, /class="heading-anchor"/);
});

test('a table of contents renders for a post with 3+ headings', () => {
  const page = read('hello-world.html');
  assert.match(page, /class="toc"/);
  assert.match(page, /href="#/);
});

test('no table of contents for a post with fewer than 3 headings', () => {
  assert.ok(!read('second-post.html').includes('class="toc"'));
});

test('code blocks are highlighted by shiki and horizontally scrollable', () => {
  const page = read('hello-world.html');
  assert.match(page, /class="astro-code/);
  assert.match(page, /class="code-scroll"/);
});

test('reading time is shown', () => {
  assert.match(read('hello-world.html'), /약 \d+분/);
});

test('the raw markdown is downloadable', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'hello-world.md')));
  assert.match(
    readFileSync(join(SERVE_ROOT, 'hello-world.md'), 'utf8'),
    /첫 번째 절/,
  );
});

test('a scroll progress bar is present', () => {
  assert.match(read('hello-world.html'), /class="progress-bar"/);
});

// --- fix round: table/code overflow, scroll spy, ToC render -------------
//
// Findings from a review of Task 7's shipped code, kept as regression
// coverage. Finding 4 below is verified as the restored `open`-attribute
// behaviour rather than the CSS-only approach first proposed for it,
// because real-browser screenshots showed Chromium does not paint the
// CSS-only version.

test('a pre or table nested inside a blockquote or list item is still wrapped for horizontal scroll (Finding 3)', async () => {
  // The rehype plugin only walked `tree.children` - the document root's
  // direct children - so a <table> nested inside a <blockquote> (valid
  // GFM, e.g. a quoted table) was never wrapped in `.table-scroll` and
  // could widen the page on a phone. Exercise the actual shipped plugin
  // (not a re-implementation) directly against a synthetic hast tree.
  const config = (await import('../astro.config.ts')).default;
  const rehypePlugins = config.markdown?.rehypePlugins ?? [];
  assert.ok(
    rehypePlugins.length > 0,
    'expected rehype plugins to be configured',
  );
  const wrapPlugin = rehypePlugins[rehypePlugins.length - 1];
  assert.equal(
    typeof wrapPlugin,
    'function',
    'expected a rehype plugin factory',
  );
  const transform = (wrapPlugin as () => (tree: TestNode) => void)();

  const table = (id: string): TestNode => ({
    type: 'element',
    tagName: 'table',
    properties: { id },
    children: [],
  });
  const pre = (id: string): TestNode => ({
    type: 'element',
    tagName: 'pre',
    properties: { id },
    children: [],
  });

  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'blockquote',
        properties: {},
        children: [table('nested-in-blockquote')],
      },
      {
        type: 'element',
        tagName: 'li',
        properties: {},
        children: [pre('nested-in-li')],
      },
      pre('root-level'),
      table('root-level'),
    ],
  };

  transform(tree);

  const findWrapped = (node: TestNode, id: string): boolean => {
    if (node.type === 'element' && node.tagName === 'div') {
      const child = node.children?.[0];
      if (
        child?.properties?.id === id &&
        (child.tagName === 'table' || child.tagName === 'pre')
      ) {
        const className = node.properties?.className;
        const wanted = child.tagName === 'pre' ? 'code-scroll' : 'table-scroll';
        return Array.isArray(className)
          ? className.includes(wanted)
          : String(className ?? '').includes(wanted);
      }
    }
    return (node.children ?? []).some((child: TestNode) =>
      findWrapped(child, id),
    );
  };

  assert.ok(
    findWrapped(tree, 'nested-in-blockquote'),
    'a table nested inside a blockquote must be wrapped in .table-scroll',
  );
  assert.ok(
    findWrapped(tree, 'nested-in-li'),
    'a pre nested inside a list item must be wrapped in .code-scroll',
  );
  assert.ok(
    findWrapped(tree, 'root-level'),
    'root-level pre/table wrapping must still work (no regression)',
  );
});

test('wide code and tables scroll inside themselves rather than bleeding out', () => {
  // While the article was centred inside .shell-main's column there were 30px
  // of slack on its left, and wide blocks bled into it. The article now sits
  // on the column's left edge, so there is nothing left to bleed into -- a
  // bleed would put code left of every other element on the site. Any
  // reintroduced negative left margin on these wrappers is that regression.
  const css = readFileSync(join('src', 'styles', 'post.css'), 'utf8');

  assert.match(
    css,
    /\.code-scroll,\n\s*\.post__content pre,\n\s*\.table-scroll \{[^}]*overflow-x:\s*auto/,
    'wide blocks must scroll inside themselves',
  );
  assert.ok(
    !/margin-left:\s*-/.test(css),
    'no wrapper may pull left of the article column',
  );
});

test('the article, its rail and its comments all start at the column left edge', () => {
  // "그리드 다 안맞고": the article group used to be centred inside
  // .shell-main, starting 30px right of where the index's cards, the header's
  // utility bar and the footer's copyright all start. Everything on the site
  // now shares one left edge.
  const css = readFileSync(join('src', 'styles', 'post.css'), 'utf8');

  const postPage = css.match(/\.post-page \{([^}]*)\}/);
  assert.ok(postPage, 'expected a .post-page rule');
  assert.ok(
    !/margin:\s*0 auto/.test(postPage[1]) && !/max-width/.test(postPage[1]),
    '.post-page must fill .shell-main rather than centring a narrower group inside it',
  );
  assert.match(
    postPage[1],
    /justify-content:\s*space-between/,
    'the article takes the left edge and the rail the right',
  );

  const comments = css.match(/\.comments \{([^}]*)\}/);
  assert.ok(comments, 'expected a .comments rule');
  assert.ok(
    !/auto/.test(comments[1]),
    '.comments must start at the column left edge, not be centred',
  );
});

test('the table of contents scroll spy is position-based, not a fixed IntersectionObserver band (Finding 2)', () => {
  const page = read('hello-world.html');
  assert.match(
    page,
    /getBoundingClientRect/,
    'expected the position-based active-heading calculation to ship',
  );
  assert.ok(
    !page.includes('rootMargin'),
    'the old fixed-band IntersectionObserver, which strands headings after the first on a short final section, must be gone',
  );
});

test('the table of contents starts open so the desktop rail is never stuck collapsed (Finding 4)', () => {
  // A CSS-only "closed by default, forced visible at >=1200px" approach was
  // tried and reverted: real-browser screenshots showed Chromium does not
  // paint a closed <details>'s content no matter what override is applied
  // to the child. `open` in the markup is the verified-working state.
  const page = read('hello-world.html');
  assert.match(page, /<details class="toc__details" open>/);
});

test('a parser-blocking classic script closes the disclosure on narrow viewports before first paint (Finding 4, round 2)', () => {
  // `open` stays in the markup (see the test above), so the panel must
  // instead be closed on a phone by a plain classic <script> that runs
  // during parsing, immediately after the toc markup - not by the
  // deferred <script type="module"> below, which only runs after the
  // whole document (and likely the first paint) is already parsed.
  const page = read('hello-world.html');
  const match = page.match(
    /<\/aside>(<script(?![^>]*type=)[^>]*>)([\s\S]*?)<\/script>/,
  );
  assert.ok(
    match,
    'expected a <script> tag immediately after the toc </aside>',
  );
  assert.equal(
    match[1],
    '<script>',
    'must be a bare classic script - no type="module", defer, or async - or it will not block the parser',
  );
  assert.match(
    match[2],
    /window\.matchMedia\('\(max-width: 1199px\)'\)\.matches/,
  );
  assert.match(
    match[2],
    /document\.querySelector\('\.toc__details'\)/,
    'must reference the <details> directly rather than waiting for an event',
  );
  assert.match(match[2], /\.open\s*=\s*false/);
});

test('the close-on-load logic is not duplicated in the deferred module script (Finding 4, round 2)', () => {
  const page = read('hello-world.html');
  const moduleScripts = [
    ...page.matchAll(/<script type="module">([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);
  const tocModuleScript = moduleScripts.find((s) =>
    s.includes('getBoundingClientRect'),
  );
  assert.ok(tocModuleScript, 'expected the toc scroll-spy module script');
  // Only the click-to-close handler should ever set `.open` here - a
  // second, unconditional "close on load" assignment (the behaviour now
  // owned solely by the parser-blocking inline script) would mean it is
  // duplicated rather than living in exactly one place.
  const openAssignments = tocModuleScript.match(/\.open\s*=/g) ?? [];
  assert.equal(
    openAssignments.length,
    1,
    'expected exactly one `.open =` assignment (the click-to-close handler) - a second would mean the close-on-load logic got duplicated back in',
  );
});
