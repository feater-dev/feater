#!/usr/bin/env bash

set -ex

docker pull alpine:3.9
docker pull docker/compose:${FEATER_DOCKER_COMPOSE_VERSION}

nginx -g "daemon on;" # TODO It may vary depending on OS used.
mongod --fork --bind_ip 0.0.0.0 --logpath /var/log/mongodb.log --dbpath /data/mongo # TODO It may vary depending on OS used.

pm2-runtime --name feater_server /app/server/main.js
