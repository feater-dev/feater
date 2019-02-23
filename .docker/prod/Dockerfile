FROM node:10-alpine

WORKDIR /app

COPY ./server/package.json ./server/yarn.lock ./

RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY ./server .

RUN yarn run tsc --skipLibCheck

# ------------------------------------------------------------------------------

FROM node:10-alpine

WORKDIR /app

COPY ./client/package.json ./client/yarn.lock ./

RUN yarn install --frozen-lockfile \
    && yarn cache clean

COPY ./client .

RUN touch src/environments/environment.ts \
    && yarn run ng build --prod

# ------------------------------------------------------------------------------

FROM node:10-alpine

WORKDIR /app

RUN apk add --update --no-cache bash curl unzip git nginx

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
    && (mkdir /data && cd /data && mkdir asset build identity proxy)

COPY --from=0 /app/package.json /app/yarn.lock ./server/

RUN (cd ./server && yarn install --prod --frozen-lockfile) \
    && yarn cache clean

COPY --from=0 /app/dist ./server

COPY --from=1 /app/dist ./client

EXPOSE 9010 9011

CMD ["/command.sh"]
