# TODO Maybe Node.js image should be used for build.
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

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn install

COPY . .

RUN yarn run tsc --skipLibCheck

# ------------------------------------------------------------------------------

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

COPY --from=0 /app/package.json ./package.json
COPY --from=0 /app/yarn.lock ./yarn.lock

RUN yarn install --prod

COPY --from=0 /app/dist .

CMD ["pm2-runtime", "main.js"]
