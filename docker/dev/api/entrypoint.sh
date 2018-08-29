#!/usr/bin/env bash

sleep 30s # Wait for Elasticsearch to spin up.

cd /app
yarn install
/app/run-server.sh
