#!/usr/bin/env bash
set -euo pipefail

# Purges jungho.dev's CV files from the Cloudflare cache after a deploy.
#
#   bash scripts/purge-cv.sh             # the four CV files
#   bash scripts/purge-cv.sh <url>...    # these URLs instead
#   bash scripts/purge-cv.sh --verify    # only check that the token is active
#
# Cloudflare caches /cv/* with the origin's max-age=14400, so without a purge
# a new CV reaches readers up to four hours after the rollout. The token needs
# only Zone > Cache Purge on jungho.dev. The certbot DNS token in
# packages/ingress-reverse-proxy/ini/cloudflare.ini verifies and reads the
# zone but is refused by purge_cache (401, code 10000, 2026-10-30).
# Setup and what to do when Cloudflare refuses: docs/setup/cloudflare-cache-purge.md

CONFIG_DIR="${KYLE_SERVER_CONFIG_DIR:-$HOME/.config/kyle-server}"
CONFIG="$CONFIG_DIR/cloudflare-purge.env"
DOC="docs/setup/cloudflare-cache-purge.md"
API="https://api.cloudflare.com/client/v4"

if [ ! -f "$CONFIG" ]; then
  echo "error: $CONFIG not found. Create it as described in $DOC." >&2
  exit 1
fi

# Read KEY=VALUE lines without sourcing the file, so nothing in it runs.
read_value() {
  sed -n "s/^$1=//p" "$CONFIG" | tail -n 1 | tr -d '\r' | sed -e 's/^"//' -e 's/"$//'
}

TOKEN=$(read_value CLOUDFLARE_PURGE_TOKEN)
ZONE_ID=$(read_value CLOUDFLARE_ZONE_ID)

if [ -z "$TOKEN" ]; then
  echo "error: CLOUDFLARE_PURGE_TOKEN is empty in $CONFIG. Paste the token as described in $DOC." >&2
  exit 1
fi
if [ -z "$ZONE_ID" ]; then
  echo "error: CLOUDFLARE_ZONE_ID is empty in $CONFIG. Copy it from the jungho.dev Overview page (API section)." >&2
  exit 1
fi

# The token goes to curl through a file descriptor, never on its command line,
# so it does not show up in `ps` or in shell history.
cf() {
  local method=$1 path=$2 body=${3:-}
  curl -sS -X "$method" "$API$path" \
    -H @<(printf 'Authorization: Bearer %s\n' "$TOKEN") \
    -H 'Content-Type: application/json' \
    ${body:+--data "$body"}
}

print_errors() {
  jq -r '.errors[]? | "  code \(.code): \(.message)"' <<<"$1" >&2
}

if [ "${1:-}" = "--verify" ]; then
  resp=$(cf GET /user/tokens/verify)
  if [ "$(jq -r '.success' <<<"$resp")" = "true" ]; then
    echo "token: $(jq -r '.result.status' <<<"$resp")"
    exit 0
  fi
  echo "error: Cloudflare did not accept the token." >&2
  print_errors "$resp"
  exit 1
fi

BASE="https://jungho.dev/cv"
URLS=(
  "$BASE/jungho_park_cv_latest_ko.pdf"
  "$BASE/jungho_park_cv_latest.pdf"
  "$BASE/jungho_park_cv_latest_ko.md"
  "$BASE/jungho_park_cv_latest.md"
)
if [ $# -gt 0 ]; then
  URLS=("$@")
fi

body=$(jq -cn '{files: $ARGS.positional}' --args "${URLS[@]}")
resp=$(cf POST "/zones/$ZONE_ID/purge_cache" "$body")

if [ "$(jq -r '.success' <<<"$resp")" != "true" ]; then
  echo "error: Cloudflare refused the purge." >&2
  print_errors "$resp"
  if jq -e '.errors[]? | select(.code == 10000)' <<<"$resp" >/dev/null; then
    echo "  The token is wrong or lacks Zone > Cache Purge on jungho.dev. See $DOC, section 4." >&2
  fi
  exit 1
fi

echo "purged ${#URLS[@]} URLs"

# A 200 only means Cloudflare took the request (Cloudflare purge docs). Ask
# once more and show CF-Cache-Status: it should no longer be HIT.
sleep 2
status=0
for u in "${URLS[@]}"; do
  s=$(curl -sS -o /dev/null -D - "$u" | tr -d '\r' | sed -n 's/^[Cc][Ff]-[Cc]ache-[Ss]tatus: //p')
  echo "  ${s:-none}  $u"
  if [ "$s" = "HIT" ]; then
    status=1
  fi
done
if [ $status -ne 0 ]; then
  echo "warning: a URL is still HIT. Wait a few seconds and run this again." >&2
fi

# A MISS only says the cache was empty. Fetch each PDF the way a reader does
# and compare it with the repo file, so a run that ends here means readers get
# this checkout's CV. A mismatch usually means the rollout has not finished or
# this checkout is not the deployed commit.
CV_DIR="$(dirname "$(readlink -f "$0")")/../packages/blog-frontend/public/cv"
for u in "${URLS[@]}"; do
  case "$u" in
    *.pdf) ;;
    *) continue ;;
  esac
  file="$CV_DIR/$(basename "$u")"
  [ -f "$file" ] || continue
  live=$(curl -sS "$u" | sha256sum | cut -c1-16)
  repo=$(sha256sum "$file" | cut -c1-16)
  if [ "$live" = "$repo" ]; then
    echo "  same as repo  $u"
  else
    echo "  DIFFERENT     $u (live $live, repo $repo)" >&2
    status=1
  fi
done
exit $status
