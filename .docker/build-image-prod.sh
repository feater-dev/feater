#!/usr/bin/env bash

docker build .. --build-arg DOCKER_VERSION=18.06.3 -f ./prod/Dockerfile -t feater-prod
