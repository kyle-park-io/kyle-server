# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

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
