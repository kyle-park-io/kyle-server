currentDir=$(pwd)

cd ${currentDir}/packages/blog-backend
rm -rf build

cd ${currentDir}/packages/blog-frontend
yarn run build
cp -r -p dist ${currentDir}/packages/blog-backend/build

# public files
cp -p public/* ${currentDir}/packages/ingress-proxy/public
