#!/usr/bin/env bash

docker stop $(docker ps | grep '\sfeatbuild[a-z0-9]\{8\}_' | awk '{print $1}')
docker rm $(docker ps -a | grep '\sfeatbuild[a-z0-9]\{8\}_' | awk '{print $1}')
docker network rm $(docker network ls | grep '\sfeatbuild[a-z0-9]\{8\}_')
