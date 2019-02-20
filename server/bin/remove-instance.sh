#!/usr/bin/env bash

# TODO Move to JS code.

docker stop $(docker ps -q --filter name=${COMPOSE_PROJECT_NAME_PREFIX})
docker rm $(docker ps -a -q --filter name=${COMPOSE_PROJECT_NAME_PREFIX})
docker volume rm $(docker volume ls -q --filter name=${COMPOSE_PROJECT_NAME_PREFIX})
docker network prune -f
sudo rm -R ${FEATER_GUEST_PATH_BUILD}/${INSTANCE_HASH}
sudo rm ${FEATER_GUEST_PATH_PROXY}/instance-${INSTANCE_HASH}.conf
docker exec ${FEATER_NGINX_CONTAINER_NAME} service nginx reload
