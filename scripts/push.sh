#!/usr/bin/env bash
set -euo pipefail

# docker builder prune -f

# Publishes the two images this repo deploys.
#
#   ./push.sh --ingress 0.0.4                 # proxy only
#   ./push.sh --site 0.1.4                    # backend only
#   ./push.sh --site 0.1.4 --ingress 0.0.4    # both
#
# A version per image, because the two version lines are independent -
# site-app-server is on 0.1.x while the proxy is on 0.0.x - and because
# pushing both is usually not what you want. A change to one is not a reason
# to rebuild the other, and rebuilding site-app-server re-clones the content
# repo, which is a risk to take deliberately rather than by default.
#
# This used to call each push2gke_artifact.sh with no argument at all. That
# was fine while the version was hardcoded, but those scripts require it now
# and exit non-zero without one. With no `set -e` here both failed in turn
# and the run ended having pushed nothing - while build.sh had already
# succeeded, so it read as a deploy that worked.

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

REGISTRY=me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry

SITE_VERSION=""
INGRESS_VERSION=""

usage() {
  cat >&2 <<EOF
usage: $(basename "$0") [--site <version>] [--ingress <version>]

  --site     publish packages/blog-backend as site-app-server
  --ingress  publish packages/ingress-reverse-proxy as ingress-reverse-proxy-app-server

At least one is required. Published versions:
EOF
  for image in site-app-server ingress-reverse-proxy-app-server; do
    echo "  $image:" >&2
    gcloud artifacts docker images list "$REGISTRY/$image" \
      --include-tags --format="value(tags)" 2>/dev/null |
      grep -v '^$' | sort -V | sed 's/^/    /' >&2
  done
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --site)
      [ $# -ge 2 ] || { echo "--site needs a version" >&2; usage; }
      SITE_VERSION=$2
      shift 2
      ;;
    --ingress)
      [ $# -ge 2 ] || { echo "--ingress needs a version" >&2; usage; }
      INGRESS_VERSION=$2
      shift 2
      ;;
    -h | --help) usage ;;
    *)
      echo "unknown argument: $1" >&2
      usage
      ;;
  esac
done

if [ -z "$SITE_VERSION" ] && [ -z "$INGRESS_VERSION" ]; then
  usage
fi

# Neither image builds the frontend: site-app-server ships
# packages/blog-backend/static as it is on disk, and the proxy ships the CV
# copies in packages/ingress-reverse-proxy/public. scripts/build.sh writes
# both. On 2026-11-05 build.sh was skipped after merging PR #61, so site 0.1.25
# went out with the bundle built on 11-03 and /devrel and /profile kept the
# old text until 0.1.26. Stop before building when either is behind.
FRONTEND="$SCRIPT_DIR/../packages/blog-frontend"
if [ -n "$SITE_VERSION" ]; then
  BUNDLE=$(ls "$SCRIPT_DIR"/../packages/blog-backend/static/assets/main.blog.*.js 2>/dev/null | head -1 || true)
  if [ -z "$BUNDLE" ]; then
    echo "no frontend bundle in packages/blog-backend/static; run scripts/build.sh first" >&2
    exit 1
  fi
  NEWER=$(find "$FRONTEND/src" "$FRONTEND/public" -type f -newer "$BUNDLE" | head -5)
  if [ -n "$NEWER" ]; then
    echo "these files are newer than the bundle $(basename "$BUNDLE"); run scripts/build.sh first:" >&2
    echo "$NEWER" | sed 's/^/  /' >&2
    exit 1
  fi
fi
if [ -n "$INGRESS_VERSION" ]; then
  for f in "$FRONTEND"/public/cv/*; do
    copy="$SCRIPT_DIR/../packages/ingress-reverse-proxy/public/cv/$(basename "$f")"
    if ! cmp -s "$f" "$copy"; then
      echo "$copy differs from $f; run scripts/build.sh and commit the copies first" >&2
      exit 1
    fi
  done
fi

if [ -n "$SITE_VERSION" ]; then
  echo "==> site-app-server $SITE_VERSION"
  (cd "$SCRIPT_DIR/../packages/blog-backend" && ./push2gke_artifact.sh "$SITE_VERSION")
fi

if [ -n "$INGRESS_VERSION" ]; then
  echo "==> ingress-reverse-proxy-app-server $INGRESS_VERSION"
  (cd "$SCRIPT_DIR/../packages/ingress-reverse-proxy" && ./push2gke_artifact.sh "$INGRESS_VERSION")
fi

# Pushing publishes the image; it does not move the cluster. The rollout is
# still a separate, deliberate step - for the proxy especially, where
# hostPort plus a Recreate strategy takes the site down while the pod swaps.
echo
echo "Pushed. Nothing is running this yet - roll out with:"
if [ -n "$SITE_VERSION" ]; then
  echo "  kubectl set image deployment/site-app-server-deployment \\"
  echo "    site-app-server=$REGISTRY/site-app-server:$SITE_VERSION"
fi
if [ -n "$INGRESS_VERSION" ]; then
  echo "  kubectl set image deployment/ingress-reverse-proxy-app-server-deployment \\"
  echo "    ingress-reverse-proxy-app-server=$REGISTRY/ingress-reverse-proxy-app-server:$INGRESS_VERSION"
fi

# Cloudflare keeps /cv/* for max-age=14400, so a changed CV needs a purge or
# readers get the old PDF for up to four hours.
echo "If the CV changed, after the rollout finishes:"
echo "  bash scripts/purge-cv.sh"
