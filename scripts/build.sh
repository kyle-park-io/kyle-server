currentDir=$(pwd)

cd ${currentDir}/packages/blog-backend
rm -rf static
rm -rf dist

cd ${currentDir}/packages/blog-frontend
# rm -rf static
# yarn run build
yarn run clean-build-prod
cp -r -p static ${currentDir}/packages/blog-backend/static

# public files
cp -r -p public/* ${currentDir}/packages/ingress-proxy/public
