import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  chmodSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SCRIPT = resolve('scripts/build-blog.sh');

/**
 * Builds a sandbox where the "astro build" step is a stub script we control,
 * so the test exercises the sync/build/swap logic rather than astro itself.
 */
function sandbox({ buildExitCode = 0 } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'build-blog-'));

  const contentSrc = join(root, 'content');
  mkdirSync(join(contentSrc, 'posts', 'a-post'), { recursive: true });
  writeFileSync(join(contentSrc, 'posts', 'a-post', 'index.md'), '# a');

  const siteDir = join(root, 'site');
  mkdirSync(siteDir, { recursive: true });

  // Stub build command: writes dist/index.html then exits with the given code.
  const stub = join(siteDir, 'fake-build.sh');
  writeFileSync(
    stub,
    [
      '#!/bin/sh',
      'mkdir -p "$PWD/dist"',
      'echo "<h1>built $(date +%s%N)</h1>" > "$PWD/dist/index.html"',
      `exit ${buildExitCode}`,
    ].join('\n') + '\n',
  );
  chmodSync(stub, 0o755);

  const blogDist = join(root, 'blog-dist');

  return {
    root,
    env: {
      ...process.env,
      CONTENT_SRC: contentSrc,
      SITE_DIR: siteDir,
      BLOG_DIST: blogDist,
      BUILD_CMD: stub,
      LOCK_FILE: join(root, 'lock'),
    },
    blogDist,
  };
}

const run = (env) => {
  try {
    return {
      ok: true,
      output: execFileSync('sh', [SCRIPT], {
        env,
        encoding: 'utf8',
        stdio: 'pipe',
      }),
    };
  } catch (err) {
    return { ok: false, output: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

test('a successful build publishes the output', () => {
  const box = sandbox();
  try {
    assert.equal(run(box.env).ok, true);
    assert.ok(existsSync(join(box.blogDist, 'index.html')));
    assert.match(
      readFileSync(join(box.blogDist, 'index.html'), 'utf8'),
      /built/,
    );
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('content is synced into the site directory before building', () => {
  const box = sandbox();
  try {
    run(box.env);
    assert.ok(
      existsSync(
        join(box.env.SITE_DIR, 'src', 'data', 'posts', 'a-post', 'index.md'),
      ),
    );
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a failed build leaves the previously published output in place', () => {
  const good = sandbox();
  try {
    run(good.env);
    const before = readFileSync(join(good.blogDist, 'index.html'), 'utf8');

    const failing = { ...good.env };
    const stub = join(good.env.SITE_DIR, 'failing-build.sh');
    writeFileSync(stub, '#!/bin/sh\nmkdir -p "$PWD/dist"\nexit 1\n');
    chmodSync(stub, 0o755);
    failing.BUILD_CMD = stub;

    const result = run(failing);
    assert.equal(result.ok, false, 'the script must exit non-zero');
    assert.equal(
      readFileSync(join(good.blogDist, 'index.html'), 'utf8'),
      before,
      'published output must be untouched',
    );
  } finally {
    rmSync(good.root, { recursive: true, force: true });
  }
});

test('a build that exits 0 but produces no index.html leaves the previously published output in place', () => {
  const good = sandbox();
  try {
    run(good.env);
    const before = readFileSync(join(good.blogDist, 'index.html'), 'utf8');

    const missingIndex = { ...good.env };
    const stub = join(good.env.SITE_DIR, 'no-index-build.sh');
    writeFileSync(stub, '#!/bin/sh\nmkdir -p "$PWD/dist"\nexit 0\n');
    chmodSync(stub, 0o755);
    missingIndex.BUILD_CMD = stub;

    const result = run(missingIndex);
    assert.equal(result.ok, false, 'the script must exit non-zero');
    assert.match(result.output, /no index\.html/);
    assert.equal(
      readFileSync(join(good.blogDist, 'index.html'), 'utf8'),
      before,
      'published output must be untouched',
    );
  } finally {
    rmSync(good.root, { recursive: true, force: true });
  }
});

test('a build that nests its output under dist/blog still publishes index.html at the root of BLOG_DIST', () => {
  const box = sandbox();
  try {
    const stub = join(box.env.SITE_DIR, 'nested-build.sh');
    writeFileSync(
      stub,
      [
        '#!/bin/sh',
        'mkdir -p "$PWD/dist/blog"',
        'echo "<h1>nested build</h1>" > "$PWD/dist/blog/index.html"',
        'exit 0',
      ].join('\n') + '\n',
    );
    chmodSync(stub, 0o755);

    const nested = { ...box.env, BUILD_CMD: stub };
    assert.equal(run(nested).ok, true);
    assert.ok(
      existsSync(join(box.blogDist, 'index.html')),
      'index.html must be published at the root of BLOG_DIST',
    );
    assert.ok(
      !existsSync(join(box.blogDist, 'blog', 'index.html')),
      'the dist/blog nesting level must be stripped, not preserved',
    );
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a stale temporary directory from a previous crash does not block the build', () => {
  const box = sandbox();
  try {
    mkdirSync(`${box.blogDist}.new`, { recursive: true });
    writeFileSync(join(`${box.blogDist}.new`, 'junk.html'), 'junk');
    assert.equal(run(box.env).ok, true);
    assert.ok(!existsSync(join(box.blogDist, 'junk.html')));
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a successful build records the built content commit in LAST_BUILT_FILE', () => {
  const box = sandbox();
  try {
    const gitOpts = { cwd: box.env.CONTENT_SRC, stdio: 'pipe' };
    execFileSync('git', ['init', '-q'], gitOpts);
    execFileSync('git', ['config', 'user.email', 'test@example.com'], gitOpts);
    execFileSync('git', ['config', 'user.name', 'Test'], gitOpts);
    execFileSync('git', ['add', '.'], gitOpts);
    execFileSync('git', ['commit', '-q', '-m', 'init'], gitOpts);
    const sha = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: box.env.CONTENT_SRC,
      encoding: 'utf8',
    }).trim();

    assert.equal(run(box.env).ok, true);
    const lastBuiltFile = `${box.blogDist}.last-built`;
    assert.ok(existsSync(lastBuiltFile));
    assert.equal(readFileSync(lastBuiltFile, 'utf8').trim(), sha);
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a build whose CONTENT_SRC is not a git checkout still succeeds, with no LAST_BUILT_FILE', () => {
  const box = sandbox();
  try {
    assert.equal(run(box.env).ok, true);
    assert.ok(!existsSync(`${box.blogDist}.last-built`));
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('a run whose lock is already held exits 0 without publishing', (t) => {
  const hasFlock = (() => {
    try {
      execFileSync('sh', ['-c', 'command -v flock'], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();
  if (!hasFlock) {
    t.skip('flock is not available on this platform');
    return;
  }

  const box = sandbox();
  try {
    // Hold the lock for 3s in the background, then run the script. It must
    // give up immediately and leave BLOG_DIST uncreated.
    const result = execFileSync(
      'sh',
      [
        '-c',
        `flock "${box.env.LOCK_FILE}" sleep 3 & sleep 0.3; sh "${SCRIPT}"; echo "exit=$?"; wait`,
      ],
      { env: box.env, encoding: 'utf8' },
    );
    assert.match(result, /already running/);
    assert.match(result, /exit=0/);
    assert.ok(!existsSync(join(box.blogDist, 'index.html')));
  } finally {
    rmSync(box.root, { recursive: true, force: true });
  }
});

test('the image busts its content clone when the content changes', () => {
  // Docker caches the RUN that clones the content repo, so an image built
  // after new posts were published still carried the old ones. A fresh pod
  // serves that baked build until its first cron tick, so a deploy rolled
  // the blog back: four posts left the live site for the minutes between a
  // rollout and the next tick, on 2026-09-04.
  const dockerfile = readFileSync('Dockerfile', 'utf8');

  const argAt = dockerfile.indexOf('ARG CONTENT_REV');
  const cloneAt = dockerfile.indexOf('init-script.sh');
  assert.ok(argAt !== -1, 'expected an ARG that can bust the clone layer');
  assert.ok(
    argAt < cloneAt,
    'the ARG has to come before the clone, or it busts nothing',
  );
  assert.match(
    dockerfile.slice(argAt, cloneAt + 200),
    /\$\{?CONTENT_REV\}?/,
    'the clone step must reference CONTENT_REV, or the ARG is inert',
  );

  const deploy = readFileSync('push2gke_artifact.sh', 'utf8');
  assert.match(
    deploy,
    /--build-arg=CONTENT_REV=/,
    'the deploy script has to pass it, or nothing ever busts',
  );
});
