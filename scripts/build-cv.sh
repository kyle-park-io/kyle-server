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
# Chrome cannot subset-embed the .otf and falls back to Type3 glyphs for the
# whole document, Latin included.
#
# Code is set in JetBrains Mono (cv-print.css). Install its static TrueType
# files the same way:
#   https://github.com/JetBrains/JetBrainsMono/releases -> fonts/ttf/*.ttf
# Not the variable build (fonts/variable/, or Google Fonts): Chrome prints a
# variable font as Type3 too (2026-11-09).
if ! fc-match "Pretendard" 2>/dev/null | grep -qi pretendard; then
  echo "Pretendard is not installed - the PDF would silently use a substitute font." >&2
  echo "See the note above this check in $(basename "$0") for how to install it." >&2
  exit 1
fi
# The .otf build passes the check above but prints every glyph as Type3 (the new
# WSL of 2026-11-09 had it). On the desktop the same CV went from 3 pages to 4.
# Stop before printing.
if fc-match "Pretendard" 2>/dev/null | grep -qi '\.otf:'; then
  echo "Pretendard resolves to the .otf build; Chrome would print the text as Type3 glyphs." >&2
  echo "Install the TrueType build under alternative/ (see the note above) and move the .otf files out of the font folders." >&2
  exit 1
fi

# cv-print.css sets code in JetBrains Mono; without it a command in a bullet
# silently takes Pretendard. See the install note above.
if ! fc-match "JetBrains Mono" 2>/dev/null | grep -qi jetbrains; then
  echo "JetBrains Mono is not installed - code in the CV would silently use a substitute font." >&2
  echo "See the note above the Pretendard check in $(basename "$0") for how to install it." >&2
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
  # The PDF's title is the file name. Without one, Chrome titles the PDF with the local URL it printed
  # ("localhost:44783/packages/blog-frontend/public/cv/jungho_park_cv_latest.md#"), and a PDF viewer shows it in its tab.
  CV_LANG="$cv_lang" npx --yes md-to-pdf --config-file "${SCRIPT_DIR}/cv-pdf.config.js" --document-title "$(basename "$md" .md)" "$md" </dev/null

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

  # Type3 fonts mean Chrome drew the glyphs itself instead of embedding a font
  # (a .otf or a variable font), so the PDF no longer matches other machines.
  if grep -aq '/Subtype */Type3' "$pdf"; then
    echo "  FAIL  $pdf: text printed as Type3 glyphs, check fc-match Pretendard and JetBrains Mono" >&2
    status=1
    continue
  fi

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
