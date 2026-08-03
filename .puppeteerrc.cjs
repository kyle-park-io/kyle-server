/**
 * Puppeteer install-time configuration for this monorepo.
 *
 * Why this file exists: `md-to-pdf` (used for CV PDF generation) depends on
 * `puppeteer`, whose postinstall step tries to download a bundled Chrome
 * build and unzip it. On this box (and possibly others / CI) `unzip` is not
 * installed and there is no sudo/root access to install it, so that download
 * step fails and aborts `yarn install` for the *entire* monorepo, not just
 * the CV tooling.
 *
 * `skipDownload: true` tells Puppeteer to never attempt that download during
 * install, making `yarn install` reproducible regardless of whether `unzip`
 * or sudo are available. The CV PDF build instead points Puppeteer at the
 * system-installed Google Chrome (e.g. via `PUPPETEER_EXECUTABLE_PATH` or
 * `--launch-options`) at run time.
 *
 * See: node_modules/puppeteer-core/lib/puppeteer/common/Configuration.d.ts
 * (top-level `skipDownload` on the `Configuration` interface, honored by
 * puppeteer's `downloadBrowsers()` in lib/puppeteer/node/install.js).
 */
module.exports = {
  skipDownload: true,
};
