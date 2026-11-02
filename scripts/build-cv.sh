#!/usr/bin/env bash
set -euo pipefail

# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
CV_DIR="${SCRIPT_DIR}/../packages/blog-frontend/public/cv"
MIN_PAGES=1
# Two documents per language since 2026-11-03:
#   jungho_park_cv_latest{,_ko}.md  the resume handed to companies, at most
#                                   3 pages (Korean hiring guides allow about 3
#                                   for experienced hires; English guides say
#                                   1 to 2, see writing-guides resume.md)
#   jungho_park_cv_full{,_ko}.md    the full CV that keeps every verified fact
#                                   and has no page limit
# Per-posting CVs are cut from these in kyle-career and keep the 3-page limit.
RESUME_MAX_PAGES=3

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

# cv-print.css asks for Pretendard, which is what the site sets for Korean.
# fontconfig substitutes silently when a family is missing, so without this
# check a machine lacking the font still produces a PDF - just typeset in
# whatever it fell through to. That is how the Korean CV came to be set in
# WenQuanYi Zen Hei, a Chinese font, for a month without anyone noticing.
#
# Install (no root needed):
#   https://github.com/orioncactus/pretendard/releases -> public/static/alternative/*.ttf
#   into ~/.local/share/fonts, then `fc-cache -f`
#
# Use the TrueType build under alternative/, not the CFF-flavoured .otf:
# Chrome cannot subset-embed the .otf and falls back to Type3 bitmap glyphs
# for the whole document, Latin included.
if ! fc-match "Pretendard" 2>/dev/null | grep -qi pretendard; then
  echo "Pretendard is not installed - the PDF would silently use a substitute font." >&2
  echo "See the note above this check in $(basename "$0") for how to install it." >&2
  exit 1
fi

status=0
for md in "${CV_DIR}"/jungho_park_cv_latest.md "${CV_DIR}"/jungho_park_cv_latest_ko.md \
  "${CV_DIR}"/jungho_park_cv_full.md "${CV_DIR}"/jungho_park_cv_full_ko.md; do
  [ -f "$md" ] || { echo "missing: $md" >&2; exit 1; }
  echo "building $(basename "$md") ..."
  # cv-pdf.config.js sets English line spacing apart from Korean (cv-print.css).
  case "$md" in
    *_ko.md) cv_lang=ko ;;
    *) cv_lang=en ;;
  esac
  CV_LANG="$cv_lang" npx --yes md-to-pdf --config-file "${SCRIPT_DIR}/cv-pdf.config.js" "$md" </dev/null

  pdf="${md%.md}.pdf"
  if [ ! -s "$pdf" ]; then
    echo "  FAIL  $(basename "$pdf"): md-to-pdf produced no output (file missing or empty)" >&2
    status=1
    continue
  fi

  case "$md" in
    *_full*) max_pages="" ;;
    *) max_pages="$RESUME_MAX_PAGES" ;;
  esac

  pages=$(page_count "$pdf")
  if [ "$pages" -lt "$MIN_PAGES" ]; then
    echo "  FAIL  $(basename "$pdf"): ${pages} pages, build is broken, produced no page content" >&2
    status=1
  elif [ -n "$max_pages" ] && [ "$pages" -gt "$max_pages" ]; then
    echo "  FAIL  $(basename "$pdf"): ${pages} pages (max ${max_pages}), too long, trim content" >&2
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
