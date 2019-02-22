#!/usr/bin/env bash

docker pull alpine:3.9
docker pull docker/compose:1.23.2

nginx -g "daemon on;" # TODO Move from here as it will vary depend on OS used.

pm2-runtime --name feater_server /app/server/main.js
