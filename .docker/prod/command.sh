#!/usr/bin/env bash

set -ex

docker pull alpine:3.9
docker pull docker/compose:${FEATER_DOCKER_COMPOSE_VERSION}

nginx -g "daemon on;" # TODO Move from here as it will vary depend on OS used.

pm2-runtime --name feater_server /app/server/main.js
