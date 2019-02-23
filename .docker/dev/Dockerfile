FROM node:10-alpine

WORKDIR /app

RUN apk add --update --no-cache bash curl unzip git nginx

COPY --from=docker /usr/local/bin/docker /usr/local/bin/docker

COPY ./.docker/dev/default.conf /etc/nginx/conf.d/default.conf

COPY ./.docker/dev/command.sh /command.sh

RUN \
    # Install Nodemon.
    yarn global add nodemon \
    # Fix for Nginx pid.
    && mkdir -p /run/nginx \
    && (cd /etc/nginx/conf.d && ln -s /data/proxy) \
    && chmod +x /command.sh \
    && (mkdir /data && cd /data && mkdir asset build identity proxy)

EXPOSE 9010 9011

CMD ["/command.sh"]
