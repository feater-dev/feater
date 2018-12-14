#!/usr/bin/env bash

# TODO Move to JS code.

# Stop and remove containers, remove volumes.
docker stop $(docker ps -q --filter name=${COMPOSE_PROJECT_NAME_PREFIX})
docker rm $(docker ps -a -q --filter name=${COMPOSE_PROJECT_NAME_PREFIX})
docker volume rm $(docker volume ls -q --filter name=${COMPOSE_PROJECT_NAME_PREFIX})

# Remove networks.
docker network prune -f

# Remove sources.
sudo rm -R ${FEATER_GUEST_PATH_BUILD}/${INSTANCE_HASH}

# Remove proxy domain configs and restart Nginx.
sudo rm ${FEATER_GUEST_PATH_PROXY_DOMAIN}/instance-${INSTANCE_HASH}.conf
docker exec ${FEATER_NGINX_CONTAINER_NAME} service nginx reload
