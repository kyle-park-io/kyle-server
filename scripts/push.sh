# docker builder prune -f

currentDir=$(pwd)

cd ${currentDir}/packages/blog-backend
./push2gke.sh

cd ${currentDir}/packages/ingress-proxy
./push2gke.sh
