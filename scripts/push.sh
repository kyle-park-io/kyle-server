docker builder prune -f

cd ../packages/blog-backend
./push2gke.sh

cd ../ingress-proxy
./push2gke.sh
