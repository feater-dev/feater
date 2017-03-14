#!/usr/bin/env bash
docker stop $(docker ps | grep '\sfeat[a-f0-9]\{24\}_' | awk '{print $1}')
docker rm $(docker ps -a | grep '\sfeat[a-f0-9]\{24\}_' | awk '{print $1}')
docker network rm $(docker network ls | grep '\sfeat[a-f0-9]\{24\}_')
sudo find ../buildInstances/ -mindepth 1 -maxdepth 1 -type d -exec rm -Rf "{}" \;
