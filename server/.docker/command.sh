#!/usr/bin/env bash

sudo service nginx start
pm2-runtime --name feater_server /app/server/main.js
