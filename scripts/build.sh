cd ../packages/blog-backend
rm -rf build

cd ../blog-frontend
yarn run build
cp -r -p dist ../blog-backend/build
# public files
cp -r -p public ../blog-backend/public
