# docker builder prune -f

# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

cd ${SCRIPT_DIR}/../packages/blog-backend
./push2gke_artifact.sh

cd ${SCRIPT_DIR}/../packages/ingress-reverse-proxy
./push2gke_artifact.sh
