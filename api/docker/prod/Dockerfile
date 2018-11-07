FROM node:8

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn tsc --skipLibCheck

# -------------------------------------

FROM ubuntu:16.04

WORKDIR /app

# Install basic libraries.
RUN apt-get update \
    && apt-get install -y \
        sudo \
        curl \
        xterm \
        software-properties-common \
    && add-apt-repository -y ppa:ubuntu-toolchain-r/test \
    && apt-get update \
    && apt-get install -y \
        build-essential \
        libstdc++-4.9-dev \
        libssl-dev \
    && apt-get clean

# Install Docker CE.
RUN apt-get update \
    && apt-get install -y \
        apt-transport-https \
        ca-certificates \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce \
    && apt-get clean

# Install Docker Compose.
RUN curl -o /usr/local/bin/docker-compose -L \
        https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` \
    && chmod +x /usr/local/bin/docker-compose

# Install Node.js and NPM.
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && npm install -g --allow-root npm@latest \
    && npm install -g --allow-root forever \
    && npm install -g --allow-root yarn \
    && npm cache clean --force

COPY docker/prod/entrypoint.sh /entrypoint.sh
RUN chmod a+x /entrypoint.sh
CMD ["/entrypoint.sh"]

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY --from=0 /app/dist .
