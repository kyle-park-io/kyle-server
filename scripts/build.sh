# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

cd ${SCRIPT_DIR}/../packages/blog-backend
rm -rf static
rm -rf dist

cd ${SCRIPT_DIR}/../packages/blog-frontend
# rm -rf static
# yarn run build
yarn run clean-build-prod
cp -r -p static ${SCRIPT_DIR}/../packages/blog-backend/static

# public files
cp -r -p public/* ${SCRIPT_DIR}/../packages/ingress-reverse-proxy/public
