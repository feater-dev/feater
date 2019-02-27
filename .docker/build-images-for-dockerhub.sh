#!/usr/bin/env bash

set -ex

image_tags=(
    latest-docker-18.06.3
    latest-docker-18.09.2
    latest-docker-latest
)

docker_versions=(
    18.06.3
    18.09.2
    latest
)

for i in "${!image_tags[@]}"; do
    docker build \
        --pull --no-cache \
        --build-arg DOCKER_VERSION=${docker_versions[$i]} \
        -f ./prod/Dockerfile \
        -t feater:${image_tags[$i]} \
        ..
done
