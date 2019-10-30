#!/usr/bin/env bash

show_help () {
    cat << EndOfHelp

Required env variables:
  - FEATER_ENV
  - FEATER_CONTAINER_NAME
  - FEATER_HOST_PATH_BUILD

Optional env variables:
  - FEATER_PROXY_NETWORK_NAME
  - FEATER_DATA_VOLUME_NAME
  - FEATER_PORT_MANAGEMENT
  - FEATER_PORT_PROXY
  - FEATER_HOST_PATH_DOCKER_SOCKET

Build env variables:
  - BUILD_DOCKER_VERSION
  - BUILD_DOCKER_COMPOSE_VERSION

EndOfHelp
}

valid_arguments=true
if [[ ! "${FEATER_ENV}" =~ ^(dev|prod)$ ]]; then
    echo "You need to provide environment ('dev' or 'prod') in FEATER_ENV env variable."
    valid_arguments=false
fi

if [[ -z "${FEATER_CONTAINER_NAME}" ]]; then
    echo "You need to provide container name in FEATER_CONTAINER_NAME env variable."
    valid_arguments=false
fi

if [[ -z "${FEATER_HOST_PATH_BUILD}" ]]; then
    echo "You need to provide container name in FEATER_HOST_PATH_BUILD env variable."
    valid_arguments=false
fi

if [[ "${valid_arguments}" = false ]]; then
    show_help
    exit 1
fi

container_name=${FEATER_CONTAINER_NAME}
env=${FEATER_ENV}

set -e

# Create proxy network if it doesn't exist.
proxy_network_name=${FEATER_PROXY_NETWORK_NAME:=${container_name}_proxy}
echo "Proxy network name: ${proxy_network_name}"
if [[ -z $(docker network ls -q --filter name=${proxy_network_name}) ]]; then
    echo "Creating proxy network."
    docker network create ${proxy_network_name}
    echo "Proxy network created."
else
    echo "Proxy network exists."
fi

# Create data volume if it's name is provided and it doesn't exist.
data_volume_name=${FEATER_DATA_VOLUME_NAME}
if [[ -n "${data_volume_name}" ]]; then
	echo "Data volume name: ${data_volume_name}"
    if [[ -z $(docker volume ls -q --filter name=${data_volume_name}) ]]; then
        echo "Creating data volume."
        docker volume create ${data_volume_name}
        echo "Data volume created."
	else
        echo "Data volume exists."
    fi
else
    echo "Data volume name not provided."
fi

host_path_docker_socket=${FEATER_HOST_PATH_DOCKER_SOCKET:-/var/run/docker.sock}

echo "Building image."
image_tag=feater-${env}
docker build .. \
    --pull \
    --build-arg DOCKER_VERSION=${BUILD_DOCKER_VERSION:-18.06.3} \
    --build-arg DOCKER_COMPOSE_VERSION=${BUILD_DOCKER_COMPOSE_VERSION:-1.23.2} \
    -f ./${env}/Dockerfile \
    -t ${image_tag}
echo "Image built."

echo "Running container."
docker run \
    -p ${FEATER_PORT_MANAGEMENT:-9010}:9010 \
    -p ${FEATER_PORT_PROXY:-9011}:9011 \
    -v ${host_path_docker_socket}:/var/run/docker.sock \
    -v ${FEATER_HOST_PATH_BUILD}:/mountable-data/build \
    $([[ -n "${data_volume_name}" ]] && printf %s "-v ${data_volume_name}:/data") \
    $([[ "${env}" = "dev" ]] && printf %s "-v $(pwd)/../server:/app/server -v $(pwd)/../client:/app/client") \
    -e FEATER_PROXY_NETWORK_NAME=${proxy_network_name} \
    -e FEATER_HOST_PATH_BUILD=${FEATER_HOST_PATH_BUILD} \
    -e FEATER_HOST_PATH_DOCKER_SOCKET=${host_path_docker_socket} \
    -d \
    --name ${container_name} \
    ${image_tag}
echo "Container run."
