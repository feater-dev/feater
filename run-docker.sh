#!/usr/bin/env bash

cd docker/feat/
docker-compose up -d
docker-compose logs -f
