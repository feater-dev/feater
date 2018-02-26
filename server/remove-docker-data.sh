#!/usr/bin/env bash

docker stop $(docker ps | grep '\sfeatbuild[a-f0-9]\{24\}_' | awk '{print $1}')
docker rm $(docker ps -a | grep '\sfeatbuild[a-f0-9]\{24\}_' | awk '{print $1}')
docker network rm $(docker network ls | grep '\sfeatbuild[a-f0-9]\{24\}_')
sudo find ../../cache/build/ -mindepth 1 -maxdepth 1 -type d -exec rm -Rf "{}" \;
