#!/usr/bin/env bash

cd docker/dev/feat/
docker-compose up -d
docker-compose logs -f
