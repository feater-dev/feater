# TODO Update to Ubuntu 18 or use Alpine or Node.
FROM ubuntu:16.04

WORKDIR /app

# Install basic libraries.
# TODO Some of these may not be needed.
RUN apt-get update \
    && apt-get install -y \
        sudo \
        curl \
        python \
        vim \
        nano \
        xterm \
        unzip \
        software-properties-common \
    && add-apt-repository -y ppa:ubuntu-toolchain-r/test \
    && apt-get update \
    && apt-get install -y \
        build-essential \
        libstdc++-4.9-dev \
        libssl-dev \
    && apt-get clean

# Install Node.js, NPM, Yarn.
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g --allow-root npm@latest \
    && npm install -g --allow-root yarn

COPY ./server/package.json ./package.json
COPY ./server/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

COPY ./server .

RUN yarn run tsc --skipLibCheck

# ------------------------------------------------------------------------------

FROM node:8.10

WORKDIR /app

COPY ./client/package.json ./package.json
COPY ./client/yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

COPY ./client .
RUN touch src/environments/environment.ts

RUN yarn run ng build --prod

# ------------------------------------------------------------------------------

# TODO Update to Ubuntu 18 or use Alpine.
FROM ubuntu:16.04

WORKDIR /app

# Install basic libraries.
# TODO Some of these may not be needed.
RUN apt-get update \
    && apt-get install -y \
        sudo \
        curl \
        python \
        vim \
        nano \
        xterm \
        unzip \
        nginx \
        software-properties-common \
    && add-apt-repository -y ppa:ubuntu-toolchain-r/test \
    && apt-get update \
    && apt-get install -y \
        build-essential \
        libstdc++-4.9-dev \
        libssl-dev \
    && apt-get clean

# Install Node.js, NPM, Yarn.
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g --allow-root npm@latest \
    && npm install -g --allow-root yarn

# Install Docker CE.
RUN apt-get install -y apt-transport-https ca-certificates curl software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce

# Install Docker Compose.
RUN curl -o /usr/local/bin/docker-compose -L \
        https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` \
    && chmod +x /usr/local/bin/docker-compose

# Install PM2.
RUN yarn global add pm2

RUN (cd /etc/nginx/conf.d && ln -s /data/proxy)

RUN mkdir -p /data/build /data/asset /data/proxy

RUN rm /etc/nginx/sites-enabled/default
COPY ./server/.docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./server/.docker/command.sh /command.sh

RUN chmod +x /command.sh

COPY --from=0 /app/package.json ./server/package.json
COPY --from=0 /app/yarn.lock ./server/yarn.lock
RUN (cd ./server && yarn install --prod --frozen-lockfile)

COPY --from=1 /app/package.json ./client/package.json
COPY --from=1 /app/yarn.lock ./client/yarn.lock
RUN (cd ./client && yarn install --prod --frozen-lockfile)

COPY --from=0 /app/dist ./server

COPY --from=1 /app/dist ./client

EXPOSE 9010
EXPOSE 9011

CMD ["/command.sh"]
