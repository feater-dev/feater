#!/usr/bin/env bash

set -ex

docker pull alpine:3.9
docker pull docker/compose:${FEATER_DOCKER_COMPOSE_VERSION}

(cd ./server && yarn install)
(cd ./client && yarn install)

nginx -g "daemon on;" # TODO Move from here as it will vary depend on OS used.

(cd ./client && yarn start:dev:watch 1>&1 2>&2 &)
(cd ./server && yarn start:dev:watch 1>&1 2>&2 &)

set +x

while true; do sleep 2; done
