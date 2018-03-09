#!/usr/bin/env bash

cd /app/client
yarn install

cd /app/server
yarn install

/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf