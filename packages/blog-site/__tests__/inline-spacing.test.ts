import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
  The Astro build drops a line break that touches an inline tag, so
  "GitHub의\n<a>kyle-park-io/blog</a\n>\ndiscussions" rendered as
  "GitHub의kyle-park-io/blogdiscussions" on /blog/privacy (2026-11-28).
  A line break between two words stays a space, so only the break next to
  a tag needs an explicit {' '}. Breaks next to ( or ) are JSX expressions
  and render no text.
*/
const INLINE = 'a|code|strong|em|b|i|span|time';
const BEFORE_TAG = new RegExp(`([^\\s>}()])\\n\\s*<(${INLINE})\\b`, 'g');
const AFTER_TAG = new RegExp(`</(${INLINE})\\s*>\\n\\s*([^\\s<{()])`, 'g');

const astroFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return astroFiles(path);
    return path.endsWith('.astro') ? [path] : [];
  });

test('no line break touches an inline tag where a space is meant', () => {
  const found: string[] = [];
  for (const file of astroFiles('src')) {
    const text = readFileSync(file, 'utf8');
    for (const re of [BEFORE_TAG, AFTER_TAG]) {
      for (const m of text.matchAll(re)) {
        const line = text.slice(0, m.index).split('\n').length;
        found.push(`${file}:${line} ${JSON.stringify(m[0].trim())}`);
      }
    }
  }
  assert.deepEqual(
    found,
    [],
    `put {' '} at the line break:\n${found.join('\n')}`,
  );
});

const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';
const text = (file: string) =>
  readFileSync(join(SERVE_ROOT, file), 'utf8')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ');

test('the privacy page keeps the spaces around its links', () => {
  const page = text('privacy.html');
  for (const phrase of [
    'GitHub의 kyle-park-io/blog 토론에',
    '쿠키는 www.aboutads.info에서',
    'the kyle-park-io/blog discussions',
    'by visiting Ads Settings',
  ]) {
    assert.ok(page.includes(phrase), `privacy.html lacks "${phrase}"`);
  }
});
