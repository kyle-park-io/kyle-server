import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file) => readFileSync(join(SERVE_ROOT, file), 'utf8');

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
// Findings from a review of Task 7's shipped code (kept as regression
// coverage — see the fix-round section of task-7-report.md for the full
// investigation, including why Finding 4 is verified here as the restored
// `open`-attribute behaviour rather than the CSS-only approach the review
// first proposed, which real-browser screenshots showed Chromium does not
// paint).

test('a pre or table nested inside a blockquote or list item is still wrapped for horizontal scroll (Finding 3)', async () => {
  // The rehype plugin only walked `tree.children` — the document root's
  // direct children — so a <table> nested inside a <blockquote> (valid
  // GFM, e.g. a quoted table) was never wrapped in `.table-scroll` and
  // could widen the page on a phone. Exercise the actual shipped plugin
  // (not a re-implementation) directly against a synthetic hast tree.
  const config = (await import('../astro.config.mjs')).default;
  const rehypePlugins = config.markdown.rehypePlugins;
  const wrapPlugin = rehypePlugins[rehypePlugins.length - 1];
  assert.equal(
    typeof wrapPlugin,
    'function',
    'expected a rehype plugin factory',
  );
  const transform = wrapPlugin();

  const table = (id) => ({
    type: 'element',
    tagName: 'table',
    properties: { id },
    children: [],
  });
  const pre = (id) => ({
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

  const findWrapped = (node, id) => {
    if (node.type === 'element' && node.tagName === 'div') {
      const child = node.children[0];
      if (
        child?.properties?.id === id &&
        (child.tagName === 'table' || child.tagName === 'pre')
      ) {
        return node.properties.className.includes(
          child.tagName === 'pre' ? 'code-scroll' : 'table-scroll',
        );
      }
    }
    return (node.children ?? []).some((child) => findWrapped(child, id));
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

test('the desktop code/table bleed is not neutralised by max-width: 100% (Finding 1)', () => {
  const css = readFileSync(join('src', 'styles', 'post.css'), 'utf8');
  const bleedBlock = css.match(
    /@media \(min-width: 1200px\) \{[^}]*\.table-scroll \{([^}]*)\}/,
  );
  assert.ok(bleedBlock, 'expected the desktop bleed rule for .table-scroll');
  assert.match(
    bleedBlock[1],
    /max-width:\s*none/,
    'max-width: 100% set earlier in the file otherwise wins over width, and the bleed never happens',
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
