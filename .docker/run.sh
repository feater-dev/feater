#!/usr/bin/env bash

show_help () {
    cat << EndOfHelp

Required env variables:
  - FEATER_ENV
  - FEATER_CONTAINER_NAME

Optional env variables:
  - FEATER_PROXY_NETWORK_NAME
  - FEATER_DATA_VOLUME_NAME
  - FEATER_DOCKER_VERSION
  - FEATER_PORT_MANAGEMENT
  - FEATER_PORT_PROXY

EndOfHelp
}

valid_arguments=true
if [[ -z "${FEATER_CONTAINER_NAME}" ]]; then
    echo "You need to provide container name in FEATER_CONTAINER_NAME env variable."
    valid_arguments=false
fi

if [[ ! "${FEATER_ENV}" =~ ^(dev|prod)$ ]]; then
    echo "You need to provide environment ('dev' or 'prod') in FEATER_ENV env variable."
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
set -x
if [[ -z $(docker network ls -q --filter name=${proxy_network_name}) ]]; then
    docker network create ${proxy_network_name}
    echo "Proxy network created."
fi

set +x

# Create data volume if it's name is provided and it doesn't exist.
data_volume_name=${FEATER_DATA_VOLUME_NAME}
if [[ -n "${data_volume_name}" ]]; then
    echo "Data volume name: ${data_volume_name}"
    set -x
    if [[ -z $(docker volume ls -q --filter name=${data_volume_name}) ]]; then
        docker volume create ${data_volume_name}
        echo "Data volume created."
    fi
    set +x
else
    echo "Data volume name not provided."
fi

# Build image.
image_tag=feater-${env}
set -x
docker build .. \
    --pull \
    --build-arg DOCKER_VERSION=${FEATER_DOCKER_VERSION:-18.06.3} \
    -f ./${env}/Dockerfile \
    -t ${image_tag}
set +x

# Run container.
set -x
docker run \
    -p ${FEATER_PORT_MANAGEMENT:-9010}:9010 \
    -p ${FEATER_PORT_PROXY:-9011}:9011 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    $([[ -n "${data_volume_name}" ]] && printf %s "-v ${data_volume_name}:/data") \
    $([[ "${env}" = "dev" ]] && printf %s "-v $(pwd)/../server:/app/server -v $(pwd)/../client:/app/client") \
    -e FEATER_PROXY_NETWORK_NAME=${proxy_network_name} \
    -d \
    --name ${container_name} \
    ${image_tag}
set +x
