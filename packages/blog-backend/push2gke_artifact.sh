#!/bin/sh

PROJECT_ID=kyle-server-402706
REPOSITORY=kyle-registry
LOCATION=me-west1
IMAGE=site-app-server
TAG=0.0.1
TAG_LATEST=latest

# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
DOCKERFILE_PATH=$SCRIPT_DIR/Dockerfile
# Context is the repo root: the image needs packages/blog-site and
# packages/site-shell alongside this package.
CONTEXT_PATH=$SCRIPT_DIR/../..

set -e

# delete all images with tags (this will automatically handle dependencies)
gcloud artifacts docker images delete $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE --delete-tags --quiet || true

# IMAGE_TAG=me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/site-app-server:0.0.1
IMAGE_TAG=$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG
# --no-cache
# CONTENT_REV busts the Dockerfile's cached clone of the content repo, so the
# baked build carries the posts that are published now. A fresh pod serves
# that build until its first cron tick, and without this a deploy after a new
# post rolled the blog back to whatever was published when the layer was
# first cached.
CONTENT_REV=$(git ls-remote https://github.com/kyle-park-io/blog.git HEAD | cut -f1)

docker buildx build --no-cache --platform linux/amd64 --build-arg=PROGRAM_VER=0.0.1 --build-arg=CONTENT_REV="$CONTENT_REV" --load -t $IMAGE_TAG -f $DOCKERFILE_PATH $CONTEXT_PATH
# docker buildx build --no-cache --platform linux/amd64 --build-arg=PROGRAM_VER=0.0.1 --push -t $IMAGE_TAG -f $DOCKERFILE_PATH $CONTEXT_PATH
docker push $IMAGE_TAG

IMAGE_TAG_LATEST=$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG_LATEST
docker tag $IMAGE_TAG $IMAGE_TAG_LATEST
docker push $IMAGE_TAG_LATEST

# # git tag -a $1 -m "add tag for $1"
# # git push origin main --tags
