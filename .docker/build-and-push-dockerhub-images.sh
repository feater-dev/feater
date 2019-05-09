#!/usr/bin/env bash

set -ex

version=latest

docker_versions=(
    18.06.3
    18.09.2
    latest
)

for i in "${!docker_versions[@]}"; do
    docker build \
        --pull \
        --build-arg DOCKER_VERSION=${docker_versions[$i]} \
        -f ./prod/Dockerfile \
        -t feater/feater:${version}-docker-${docker_versions[$i]} \
        ..

    docker push feater/feater:${version}-docker-${docker_versions[$i]}
done

