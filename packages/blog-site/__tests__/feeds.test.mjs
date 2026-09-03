import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const read = (file) => readFileSync(join(SERVE_ROOT, file), 'utf8');

test('a static page exists per tag', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'tags', 'tooling.html')));
  assert.ok(existsSync(join(SERVE_ROOT, 'tags', 'ethereum.html')));
});

test('a tag page lists only its own posts', () => {
  const page = read(join('tags', 'ethereum.html'));
  assert.match(page, /두 번째 글/);
  assert.ok(!page.includes('첫 번째 글'), 'untagged post must not appear');
});

test('a tag page is canonical to itself', () => {
  assert.match(
    read(join('tags', 'ethereum.html')),
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/tags\/ethereum"/,
  );
});

test('rss lists every post with absolute links', () => {
  const xml = read('rss.xml');
  assert.match(
    xml,
    /<title><!\[CDATA\[첫 번째 글\]\]><\/title>|<title>첫 번째 글<\/title>/,
  );
  assert.match(xml, /https:\/\/jungho\.dev\/blog\/hello-world/);
  assert.equal((xml.match(/<item>/g) ?? []).length, 2);
});

test('rss item links have no trailing slash and match the canonical URL', () => {
  const xml = read('rss.xml');
  const itemLinks = [
    ...xml.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g),
  ].map((m) => m[1]);
  assert.deepEqual(itemLinks, [
    'https://jungho.dev/blog/hello-world',
    'https://jungho.dev/blog/second-post',
  ]);
  for (const link of itemLinks) {
    assert.ok(!link.endsWith('/'), `${link} must not have a trailing slash`);
  }

  const itemGuids = [
    ...xml.matchAll(/<item>[\s\S]*?<guid[^>]*>([^<]+)<\/guid>/g),
  ].map((m) => m[1]);
  assert.deepEqual(itemGuids, itemLinks);

  // Cross-check against the homepage JSON feed's `url` (the same post must
  // not be addressed differently across the site).
  const items = JSON.parse(read('index.json'));
  const jsonLinks = items.map((item) => `https://jungho.dev${item.url}`);
  assert.deepEqual(itemLinks, jsonLinks);

  // Cross-check against the article page's own canonical <link>.
  assert.match(
    read('hello-world.html'),
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/hello-world">/,
  );
  assert.match(
    read('second-post.html'),
    /<link rel="canonical" href="https:\/\/jungho\.dev\/blog\/second-post">/,
  );
});

test('index.json is newest-first and carries what the homepage needs', () => {
  const items = JSON.parse(read('index.json'));
  assert.equal(items.length, 2);
  assert.equal(items[0].slug, 'hello-world');
  assert.deepEqual(Object.keys(items[0]).sort(), [
    'date',
    'slug',
    'summary',
    'tags',
    'title',
    'url',
  ]);
  assert.equal(items[0].url, '/blog/hello-world');
  assert.match(items[0].date, /^\d{4}-\d{2}-\d{2}$/);
});

test('a 404 page is emitted', () => {
  assert.ok(existsSync(join(SERVE_ROOT, '404.html')));
  assert.match(read('404.html'), /글을 찾을 수 없습니다/);
});

test('the sitemap index is emitted', () => {
  assert.ok(existsSync(join(SERVE_ROOT, 'sitemap-index.xml')));
  const files = readFileSync(join(SERVE_ROOT, 'sitemap-index.xml'), 'utf8');
  assert.match(files, /sitemap-0\.xml/);
});

test('the sitemap contains post URLs', () => {
  assert.match(
    read('sitemap-0.xml'),
    /https:\/\/jungho\.dev\/blog\/hello-world/,
  );
});
