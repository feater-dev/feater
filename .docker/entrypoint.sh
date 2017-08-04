#!/bin/bash

cd /app/client
npm install
./build-dev.sh

cd /app/server
npm install
./run-server.sh

while true; do echo a >> /dev/null ; sleep 1; done
