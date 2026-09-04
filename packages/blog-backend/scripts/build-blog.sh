#!/bin/sh
# Sync the content repo into the astro project, build it, and atomically
# publish the result.
#
# Called by cron every 10 minutes and once at image build time. Every path is
# overridable so the tests can drive it against fixtures.
#
# Guarantees:
#   - a failed build never replaces the live output
#   - a crashed previous run cannot leave a half-built directory in place
#   - two runs never build at the same time

set -eu

# cron(8) runs jobs with PATH=/usr/bin:/bin (Debian's default) and does not
# inherit the daemon's environment, so `npm`/`node` — installed under
# /usr/local/bin in node:22-slim — are invisible unless we put them on PATH
# ourselves. Without this, `npm run build` below fails "not found", `set -eu`
# aborts, BLOG_DIST is never swapped, and /blog silently keeps serving the
# image-baked build forever. A normal interactive shell or `docker run`
# already has /usr/local/bin on PATH, which is why this was easy to miss.
PATH="/usr/local/bin:/usr/local/sbin:$PATH"
export PATH

CONTENT_SRC="${CONTENT_SRC:-/blog/content}"
SITE_DIR="${SITE_DIR:-/usr/src/blog-site}"
BLOG_DIST="${BLOG_DIST:-/usr/src/app/blog-dist}"
LOCK_FILE="${LOCK_FILE:-/tmp/build-blog.lock}"
BUILD_CMD="${BUILD_CMD:-}"

log() { echo "[build-blog] $*"; }

# Serialise runs: re-enter under flock, then fall through to the real work.
#
# `-E 99` makes "could not acquire the lock" distinguishable from "the child
# exited 1", which a plain `flock -n` conflates. Do not use `exec` here — it
# would replace this shell, so the exit-code check below could never run.
if [ -z "${BUILD_BLOG_LOCKED:-}" ] && command -v flock >/dev/null 2>&1; then
  BUILD_BLOG_LOCKED=1
  export BUILD_BLOG_LOCKED
  # `flock` is a plain command here, not the condition of an `if`/`&&`/`||`,
  # so under `set -e` a non-zero exit (lock busy -> 99) would abort the
  # script before `status=$?` ever ran, propagating the raw 99 instead of
  # being translated to exit 0 below. Guard it with `if` — POSIX exempts a
  # command tested that way from errexit.
  if flock -n -E 99 "$LOCK_FILE" "$0" "$@"; then
    status=0
  else
    status=$?
  fi
  if [ "$status" -eq 99 ]; then
    log "another build is already running; skipping"
    exit 0
  fi
  exit "$status"
fi

if [ ! -d "$CONTENT_SRC/posts" ]; then
  log "no posts at $CONTENT_SRC/posts; nothing to build"
  exit 1
fi

log "syncing content from $CONTENT_SRC"
mkdir -p "$SITE_DIR/src/data"
rm -rf "$SITE_DIR/src/data/posts"
cp -R "$CONTENT_SRC/posts" "$SITE_DIR/src/data/posts"

STAGING="$BLOG_DIST.new"
PREVIOUS="$BLOG_DIST.old"
rm -rf "$STAGING" "$PREVIOUS"

log "building"
cd "$SITE_DIR"
rm -rf dist
if [ -n "$BUILD_CMD" ]; then
  "$BUILD_CMD"
else
  npm run build
fi

# `base: '/blog'` is applied to URLs; whether it also nests the output was
# recorded in astro.config.mjs. Handle both so this never silently serves an
# empty directory.
BUILT="dist"
if [ -d "dist/blog" ]; then
  BUILT="dist/blog"
fi

if [ ! -f "$BUILT/index.html" ]; then
  log "build produced no index.html; keeping the previous output"
  exit 1
fi

log "publishing"
mkdir -p "$(dirname "$BLOG_DIST")"
cp -R "$BUILT" "$STAGING"
if [ -d "$BLOG_DIST" ]; then
  mv "$BLOG_DIST" "$PREVIOUS"
fi
mv "$STAGING" "$BLOG_DIST"
rm -rf "$PREVIOUS"

log "published $(find "$BLOG_DIST" -name '*.html' | wc -l) pages"
