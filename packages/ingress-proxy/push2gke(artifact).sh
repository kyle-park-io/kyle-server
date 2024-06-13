#!/bin/sh

PROJECT_ID=kyle-server-402706
REPOSITORY=kyle-registry
LOCATION=me-west1
IMAGE=ingress-go
TAG=0.0.1
TAG_LATEST=latest

set -e

# delete existing image
# untag
gcloud artifacts docker tags delete $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG --quiet
gcloud artifacts docker tags delete $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG_LATEST --quiet
# delete
# --filter="tags:$TAG" --format="get(DIGEST)" --limit=1
DIGEST=$(gcloud artifacts docker images list $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY --filter="PACKAGE: $IMAGE" --format="get(DIGEST)" --limit=1)
gcloud artifacts docker images delete me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/$IMAGE@$DIGEST --quiet

IMAGE_TAG=me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/ingress-go:0.0.1
# --no-cache
docker buildx build --platform linux/amd64 --build-arg=PROGRAM_VER=0.0.1 -t $IMAGE_TAG .
docker push $IMAGE_TAG

IMAGE_TAG_LATEST=me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/ingress-go:latest
docker tag $IMAGE_TAG $IMAGE_TAG_LATEST
docker push $IMAGE_TAG_LATEST

# git tag -a $1 -m "add tag for $1"
# git push origin main --tags

# gcloud container clusters get-credentials kyle-ingress-standard-cluster-1 --zone me-west1-a --project kyle-server-402706
