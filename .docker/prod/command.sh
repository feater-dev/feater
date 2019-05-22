#!/usr/bin/env bash

set -ex

proxy_network_name=${FEATER_PROXY_NETWORK_NAME}
container_id=${HOSTNAME}

# Pull auxiliary images.
docker pull alpine:3.9
docker pull docker/compose:${FEATER_DOCKER_COMPOSE_VERSION}

# Check if proxy network exists, exit otherwise.
if [[ -z $(docker network ls -q --filter name=${proxy_network_name}) ]]; then
    echo "Proxy network '${proxy_network_name}' does not exist."

    exit 1
fi

# Connect to proxy network if not already connected.
if [[ $(docker inspect --format={{.NetworkSettings.Networks.${proxy_network_name}.NetworkID}} ${container_id}) = '<no value>' ]]; then
    docker network connect ${proxy_network_name} ${container_id}
fi

# Run Nginx.
# TODO It may vary depending on OS used.
nginx -g "daemon on;"

# Run MongoDB.
# TODO It may vary depending on OS used.
mongod --fork --bind_ip 0.0.0.0 --logpath /var/log/mongodb.log --dbpath /data/mongo

# Start server application with PM2.
pm2-runtime --name feater_server /app/server/main.js
