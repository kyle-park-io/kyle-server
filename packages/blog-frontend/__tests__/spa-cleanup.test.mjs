import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('the blog components are gone', () => {
  assert.ok(!existsSync('src/blog'), 'src/blog must be deleted');
});

test('the router no longer owns blog routes', () => {
  const source = readFileSync('src/index.tsx', 'utf8');
  for (const route of ['/blog', '/blog/:id', '/blog/not-found', '/test']) {
    assert.ok(
      !source.includes(`path="${route}"`),
      `${route} must not be a SPA route — express serves it`,
    );
  }
});

test('axios and file-saver are no longer dependencies', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.dependencies.axios, undefined);
  assert.equal(pkg.dependencies['file-saver'], undefined);
  assert.equal(pkg.devDependencies['@types/file-saver'], undefined);
});

test('no source file still imports them', () => {
  const source = readFileSync('src/index.tsx', 'utf8');
  assert.ok(!source.includes('axios'));
  assert.ok(!source.includes('file-saver'));
});

test('the homepage links the blog and has no Extra section', () => {
  const app = readFileSync('src/app/App.tsx', 'utf8');
  assert.match(app, /Writing/);
  assert.match(app, /\/blog\/index\.json/);
  assert.ok(!app.includes('Extra'), 'the Extra section is removed');
});

// Every consumer that renders `site-shell`'s NavItem[] with a client-side
// router must honour the `external` marker by setting rel="external" on
// the anchor, or an item marked external (e.g. Blog, which points at an
// Express-owned path, not an SPA route) silently loses its opt-out from
// @solidjs/router's global anchor interception and becomes a dead link —
// exactly the bug this task's fix rounds exist to close. This asserts the
// contract at the source level, scoped to each component's own <For>
// block over the nav data, so it fails if either consumer ever stops
// wiring rel to item.external — not just if the string appears somewhere
// unrelated in the file.
for (const [file, arrayName] of [
  ['src/layout/Header.tsx', 'navItems'],
  ['src/components/offcanvas/Offcanvas.tsx', 'offcanvasItems'],
]) {
  test(`${file} renders rel="external" for ${arrayName} marked external`, () => {
    const source = readFileSync(file, 'utf8');
    const forBlock = source.match(
      new RegExp(`<For each=\\{${arrayName}\\}>([\\s\\S]*?)<\\/For>`),
    );
    assert.ok(
      forBlock,
      `${file} must map over ${arrayName} inside a <For> block`,
    );
    assert.match(
      forBlock[1],
      /rel=\{[^}]*item\.external[^}]*\}/,
      `${file} must set rel from item.external on the anchor it renders for each ${arrayName} entry`,
    );
  });
}
