#!/usr/bin/env bash

set -ex

nginx -g 'daemon on;'

set +x

while true; do sleep 10; done
