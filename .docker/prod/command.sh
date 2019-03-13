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
docker_inspect_format=$(printf "'{{.NetworkSettings.Networks.%s.NetworkID}}'" "${proxy_network_name}")
if [[ $(docker inspect --format=${docker_inspect_format} ${container_id}) = '<no value>' ]]; then
    docker network connect ${proxy_network_name} ${container_id}
fi

# Run Nginx.
nginx -g "daemon on;" # TODO It may vary depending on OS used.

# Run MongoDB.
mongod --fork --bind_ip 0.0.0.0 --logpath /var/log/mongodb.log --dbpath /data/mongo # TODO It may vary depending on OS used.

# Start server application with PM2.
pm2-runtime --name feater_server /app/server/main.js
