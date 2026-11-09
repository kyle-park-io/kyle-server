# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# The steps below delete the site bundle first and rebuild it with yarn. On a
# machine without yarn (the WSL on 2026-11-10) the build failed, the bundle
# stayed deleted, and only the CV copy step at the end did its job. Stop
# before deleting anything instead.
if ! command -v yarn >/dev/null 2>&1; then
  echo "yarn not found; install it (corepack enable, or npm i -g yarn) and run scripts/build.sh again" >&2
  echo "nothing was deleted. For a PDF-only release the CV copies can be made with:" >&2
  echo "  cp -p packages/blog-frontend/public/cv/* packages/ingress-reverse-proxy/public/cv/" >&2
  exit 1
fi

cd ${SCRIPT_DIR}/../packages/blog-backend
rm -rf static
rm -rf dist
# tsc is incremental: with dist gone but this left behind it decides the
# output is current, emits nothing, and `yarn test` then fails to import
# dist/app.js with no hint as to why.
rm -f tsconfig.tsbuildinfo

cd ${SCRIPT_DIR}/../packages/blog-frontend
# rm -rf static
# yarn run build
yarn run clean-build-prod
cp -r -p static ${SCRIPT_DIR}/../packages/blog-backend/static

# public files
cp -r -p public/* ${SCRIPT_DIR}/../packages/ingress-reverse-proxy/public
