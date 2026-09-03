import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const BAD_DIR = 'src/data/posts/__schema-probe';

const build = () => {
  try {
    execFileSync('yarn', ['build'], { encoding: 'utf8', stdio: 'pipe' });
    return { ok: true, output: '' };
  } catch (err) {
    return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

test('a post missing `summary` fails the build', () => {
  mkdirSync(BAD_DIR, { recursive: true });
  writeFileSync(
    `${BAD_DIR}/index.md`,
    '---\ntitle: 누락\ndate: 2026-01-01\ntags: []\n---\n\n본문\n',
  );
  try {
    const result = build();
    assert.equal(result.ok, false, 'build should have failed');
    assert.match(result.output, /summary/);
  } finally {
    rmSync(BAD_DIR, { recursive: true, force: true });
  }
});

test('an uppercase tag fails the build', () => {
  mkdirSync(BAD_DIR, { recursive: true });
  writeFileSync(
    `${BAD_DIR}/index.md`,
    '---\ntitle: 대문자\ndate: 2026-01-01\nsummary: 요약\ntags: [Ethereum]\n---\n\n본문\n',
  );
  try {
    const result = build();
    assert.equal(result.ok, false, 'build should have failed');
    assert.match(result.output, /kebab-case|tags/);
  } finally {
    rmSync(BAD_DIR, { recursive: true, force: true });
  }
});

test('the valid fixtures build cleanly', () => {
  assert.equal(build().ok, true);
});
