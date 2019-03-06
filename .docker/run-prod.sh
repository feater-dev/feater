#!/usr/bin/env bash

set -ex


docker network ls -q --filter name=feater_prod_proxy | grep -q . \
    || docker network create feater_prod_proxy

docker build .. \
    --pull \
    --build-arg DOCKER_VERSION=${FEATER_DOCKER_VERSION:-18.06.3} \
    -f ./prod/Dockerfile \
    -t feater-prod

docker run \
    -p 9010:9010 \
    -p 80:9011 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v feater_prod_data:/data \
    -e FEATER_PROXY_NETWORK_NAME=${FEATER_PROXY_NETWORK_NAME:-feater_prod_proxy} \
    -d \
    --name feater_prod \
    feater-prod
