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
