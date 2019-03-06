#!/usr/bin/env bash

set -ex

docker network ls -q --filter name=feater_dev_proxy | grep -q . \
    || docker network create feater_dev_proxy

docker build .. \
    --pull \
    --build-arg DOCKER_VERSION=${FEATER_DOCKER_VERSION:-18.06.3} \
    -f ./dev/Dockerfile \
    -t feater-dev

docker run \
    -p 9010:9010 \
    -p 80:9011 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v feater_dev_data:/data \
    -v $(pwd)/../server:/app/server \
    -v $(pwd)/../client:/app/client \
    -e FEATER_PROXY_NETWORK_NAME=${FEATER_PROXY_NETWORK_NAME:-feater_dev_proxy} \
    -d \
    --name feater_dev \
    feater-dev
