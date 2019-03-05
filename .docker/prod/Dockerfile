ARG DOCKER_VERSION

FROM docker:${DOCKER_VERSION:-latest} AS docker

# ------------------------------------------------------------------------------

FROM node:10-alpine AS server-builder

WORKDIR /app

COPY ./server/package.json ./server/yarn.lock ./

RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY ./server .

RUN yarn run tsc --skipLibCheck

# ------------------------------------------------------------------------------

FROM node:10-alpine AS client-builder

WORKDIR /app

COPY ./client/package.json ./client/yarn.lock ./

RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY ./client .

RUN touch src/environments/environment.ts \
    && yarn run ng build --prod

# ------------------------------------------------------------------------------

FROM node:10-alpine AS main

WORKDIR /app

ENV FEATER_MONGO_DSN mongodb://localhost:27017/feater
ENV FEATER_GUEST_PATH_ASSET /data/asset
ENV FEATER_GUEST_PATH_BUILD /data/build
ENV FEATER_GUEST_PATH_IDENTITY /data/identity
ENV FEATER_GUEST_PATH_PROXY /data/proxy
ENV FEATER_GIT_BINARY_PATH /usr/bin/git
ENV FEATER_DOCKER_BINARY_PATH /usr/local/bin/docker
ENV FEATER_DOCKER_COMPOSE_VERSION 1.23.2
ENV FEATER_DOCKER_COMPOSE_HTTP_TIMEOUT 500
ENV FEATER_CONTAINER_NAME_PREFIX featerinstance
ENV FEATER_PROXY_DOMAIN_PATTERN {instance_hash}-{port_id}.featerinstance.localhost
ENV FEATER_PROXY_NETWORK_NAME feater_proxy
ENV FEATER_LOG_LEVEL_CONSOLE info
ENV FEATER_LOG_LEVEL_MONGO info

RUN apk add --update --no-cache \
        bash curl unzip git openssh openssh-keygen sshpass nginx mongodb

COPY --from=docker /usr/local/bin/docker /usr/local/bin/docker

COPY ./.docker/prod/default.conf /etc/nginx/conf.d/default.conf

COPY ./.docker/prod/command.sh /command.sh

RUN \
    # Install PM2.
    yarn global add pm2 \
    # Fix for Nginx pid.
    && mkdir -p /run/nginx \
    && (cd /etc/nginx/conf.d && ln -s /data/proxy) \
    && chmod +x /command.sh \
    && (mkdir /data && cd /data && mkdir asset build identity mongo proxy)

COPY --from=server-builder /app/package.json /app/yarn.lock ./server/

RUN (cd ./server && yarn install --prod --frozen-lockfile) \
    && yarn cache clean

COPY --from=server-builder /app/dist ./server

COPY --from=client-builder /app/dist ./client

EXPOSE 9010 9011

CMD ["/command.sh"]
