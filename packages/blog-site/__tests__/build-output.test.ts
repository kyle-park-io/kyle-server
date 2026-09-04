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
  assert.ok(existsSync(index), `${index} missing — run \`yarn build\` first`);
  assert.match(readFileSync(index, 'utf8'), /Kyle Park/);
});
