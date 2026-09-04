import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GISCUS } from '../src/config/giscus.ts';

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const page = () => readFileSync(join(SERVE_ROOT, 'hello-world.html'), 'utf8');

test('the giscus ids are filled in', () => {
  assert.match(GISCUS.repoId, /^R_/);
  assert.match(GISCUS.categoryId, /^DIC_/);
});

test('the article embeds the giscus client verbatim', () => {
  const html = page();
  assert.match(html, /src="https:\/\/giscus\.app\/client\.js"/);
  assert.match(html, new RegExp(`data-repo="${GISCUS.repo}"`));
  assert.match(html, new RegExp(`data-repo-id="${GISCUS.repoId}"`));
  assert.match(html, new RegExp(`data-category-id="${GISCUS.categoryId}"`));
  assert.match(html, /data-mapping="pathname"/);
  assert.match(html, /data-loading="lazy"/);
});

test('the list page does not load giscus', () => {
  const list = readFileSync(join(SERVE_ROOT, 'index.html'), 'utf8');
  assert.ok(!list.includes('giscus.app'));
});
