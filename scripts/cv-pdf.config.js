/**
 * md-to-pdf configuration for the CV PDFs (see scripts/build-cv.sh).
 *
 * All styling lives in cv-print.css so the same rules can be reused by a
 * VS Code markdown-to-PDF extension; this file only feeds that stylesheet to
 * md-to-pdf. `stylesheet` is deliberately left at md-to-pdf's default
 * (node_modules/md-to-pdf/markdown.css) — the sheet the archived PDFs were
 * built against — and cv-print.css is appended through `css` so it overrides
 * rather than replaces it.
 */
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

module.exports = {
  css: readFileSync(join(__dirname, 'cv-print.css'), 'utf8'),

  /*
   * md-to-pdf defaults to 20mm left / 40mm right, which is asymmetric by
   * accident rather than design: it pushed the text column off-centre and
   * wasted 20mm of line width, forcing extra wrapping and a mostly empty
   * final page. Symmetric 20mm centres the column and widens it 150mm -> 170mm.
   */
  pdf_options: {
    printBackground: true,
    format: 'a4',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
  },
};
