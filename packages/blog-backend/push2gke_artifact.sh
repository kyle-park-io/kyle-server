#!/bin/sh

PROJECT_ID=kyle-server-402706
REPOSITORY=kyle-registry
LOCATION=me-west1
IMAGE=site-app-server
# The version to publish, e.g. `./push2gke_artifact.sh 0.1.4`.
#
# This was hardcoded to 0.0.1, which was harmless only because the script
# deleted every existing tag first. Now that it keeps them, a fixed tag would
# overwrite whatever 0.0.1 is and leave `latest` pointing somewhere the
# running deployment is not.
TAG=$1
TAG_LATEST=latest

if [ -z "$TAG" ]; then
  echo "usage: $(basename "$0") <version>   e.g. $(basename "$0") 0.1.4" >&2
  echo "published versions:" >&2
  gcloud artifacts docker images list \
    "me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/$IMAGE" \
    --include-tags --format="value(tags)" 2>/dev/null | grep -v '^$' | sort -V | sed 's/^/  /' >&2
  exit 1
fi

# dir
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
DOCKERFILE_PATH=$SCRIPT_DIR/Dockerfile
# Context is the repo root: the image needs packages/blog-site and
# packages/site-shell alongside this package.
CONTEXT_PATH=$SCRIPT_DIR/../..

set -e

# The previous image is not deleted here.
#
# This used to wipe every tag before pushing the new one, so at the moment a
# bad image went out there was nothing to go back to. That matters most for
# the proxy: hostPort plus a Recreate strategy means the whole site is down
# during its rollout, and `kubectl set image` to the previous tag is ~40
# seconds against several minutes to rebuild from git.
#
# Storage is not the reason it was there: the whole registry is under 2 GB,
# which is $0.15 a month past the free tier, and successive versions share
# almost every layer - pushing 0.1.3 over 0.1.2 uploaded a few tens of MB,
# the rest answering "Layer already exists". Old versions are aged out by
# the repository's cleanup policy instead, which keeps the most recent five.

# IMAGE_TAG=me-west1-docker.pkg.dev/kyle-server-402706/kyle-registry/site-app-server:0.0.1
IMAGE_TAG=$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG
# --no-cache
# CONTENT_REV busts the Dockerfile's cached clone of the content repo, so the
# baked build carries the posts that are published now. A fresh pod serves
# that build until its first cron tick, and without this a deploy after a new
# post rolled the blog back to whatever was published when the layer was
# first cached.
CONTENT_REV=$(git ls-remote https://github.com/kyle-park-io/blog.git HEAD | cut -f1)

# --provenance=false: by default buildx publishes an OCI index referencing
# the image plus an attestation manifest, and Artifact Registry lists those
# children as untagged versions of their own. Any "delete untagged" cleanup
# rule then deletes the inside of a live image and breaks `docker pull`.
# One manifest per release keeps that from being possible.
docker buildx build --provenance=false --no-cache --platform linux/amd64 --build-arg=PROGRAM_VER=0.0.1 --build-arg=CONTENT_REV="$CONTENT_REV" --load -t $IMAGE_TAG -f $DOCKERFILE_PATH $CONTEXT_PATH
# docker buildx build --no-cache --platform linux/amd64 --build-arg=PROGRAM_VER=0.0.1 --push -t $IMAGE_TAG -f $DOCKERFILE_PATH $CONTEXT_PATH
docker push $IMAGE_TAG

IMAGE_TAG_LATEST=$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE:$TAG_LATEST
docker tag $IMAGE_TAG $IMAGE_TAG_LATEST
docker push $IMAGE_TAG_LATEST

# # git tag -a $1 -m "add tag for $1"
# # git push origin main --tags
