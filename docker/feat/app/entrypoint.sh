#!/usr/bin/env bash

cd /app/client
yarn install
./build-dev.sh

cd /app/server
yarn install
./run-server.sh

while true; do echo a >> /dev/null ; sleep 1; done
