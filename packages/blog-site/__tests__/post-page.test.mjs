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
