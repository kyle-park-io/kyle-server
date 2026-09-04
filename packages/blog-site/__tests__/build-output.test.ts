import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Directory that express mounts at /blog. Task 3 Step 7 records the answer. */
export const SERVE_ROOT = existsSync(join('dist', 'blog'))
  ? join('dist', 'blog')
  : 'dist';

test('the build produced a landing page', () => {
  const index = join(SERVE_ROOT, 'index.html');
  assert.ok(existsSync(index), `${index} missing - run \`yarn build\` first`);
  const page = readFileSync(index, 'utf8');
  // The site's name is the domain, matching the home page's own <title>.
  // This used to assert /Kyle Park/, which passed on the old
  // "Kyle Park | Blog" title and would now pass only by accident, on the
  // masthead's uppercase wordmark.
  assert.match(page, /<title>Blog \| jungho\.dev<\/title>/);
  assert.match(page, /KYLE PARK/, 'the masthead wordmark should render');
});

test('markdown is not run through smartypants', () => {
  // A post's `yarn prettier . --write` reached production with the `--`
  // rewritten as an em dash: remark-smartypants is on by default and does
  // not know a CLI flag from a dash in prose. Nothing on the site should
  // carry an em, en or horizontal dash it did not author.
  const config = readFileSync('astro.config.ts', 'utf8');
  assert.match(
    config,
    /smartypants:\s*false/,
    'markdown.smartypants must stay off, or hyphens in commands become dashes',
  );

  for (const name of ['project-initial-setup', 'hello-world', 'second-post']) {
    const file = join(SERVE_ROOT, `${name}.html`);
    if (!existsSync(file)) continue;
    const page = readFileSync(file, 'utf8');
    for (const [dash, label] of [
      ['\u2014', 'em dash'],
      ['\u2013', 'en dash'],
      ['\u2015', 'horizontal bar'],
    ]) {
      assert.ok(!page.includes(dash), `${name}.html contains an ${label}`);
    }
  }
});
