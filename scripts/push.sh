# docker builder prune -f

currentDir=$(pwd)

cd ${currentDir}/packages/blog-backend
./push2gke_artifact.sh

cd ${currentDir}/packages/ingress-proxy
./push2gke_artifact.sh
