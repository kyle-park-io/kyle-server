#!/usr/bin/env bash
set -euo pipefail

# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
CV_DIR="${SCRIPT_DIR}/../packages/blog-frontend/public/cv"
MIN_PAGES=1
MAX_PAGES=4

page_count() {
  python3 -c "
import re, sys
d = open(sys.argv[1], 'rb').read()
print(len(re.findall(rb'/Type\s*/Page[^s]', d)))
" "$1"
}

# Puppeteer cannot install its bundled Chromium here (no `unzip`, sudo blocked —
# see Task 1 report). Point md-to-pdf at the system Chrome instead.
CHROME="${PUPPETEER_EXECUTABLE_PATH:-$(command -v google-chrome-stable || command -v google-chrome || true)}"
if [ -z "$CHROME" ]; then
  echo "No Chrome found. Set PUPPETEER_EXECUTABLE_PATH to a Chrome/Chromium binary." >&2
  exit 1
fi
export PUPPETEER_EXECUTABLE_PATH="$CHROME"
echo "using chrome: $CHROME"

status=0
for md in "${CV_DIR}"/jungho_park_cv_latest.md "${CV_DIR}"/jungho_park_cv_latest_ko.md; do
  [ -f "$md" ] || { echo "missing: $md" >&2; exit 1; }
  echo "building $(basename "$md") ..."
  npx --yes md-to-pdf --config-file "${SCRIPT_DIR}/cv-pdf.config.js" "$md"

  pdf="${md%.md}.pdf"
  if [ ! -s "$pdf" ]; then
    echo "  FAIL  $(basename "$pdf"): md-to-pdf produced no output (file missing or empty)" >&2
    status=1
    continue
  fi

  pages=$(page_count "$pdf")
  if [ "$pages" -lt "$MIN_PAGES" ]; then
    echo "  FAIL  $(basename "$pdf"): ${pages} pages — build is broken, produced no page content" >&2
    status=1
  elif [ "$pages" -gt "$MAX_PAGES" ]; then
    echo "  FAIL  $(basename "$pdf"): ${pages} pages (max ${MAX_PAGES}) — too long, trim content" >&2
    status=1
  else
    echo "  ok    $(basename "$pdf"): ${pages} pages"
  fi
done

if [ "$status" -ne 0 ]; then
  echo "" >&2
  echo "One or more CV PDFs failed validation (see FAIL messages above)." >&2
  exit 1
fi

echo ""
echo "Done. Run scripts/build.sh to propagate to the other packages."
