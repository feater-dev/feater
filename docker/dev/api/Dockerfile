FROM ubuntu:16.04

WORKDIR /app

# Install basic libraries.
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

# Install Node.js and NPM.
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g --allow-root npm@latest \
    && npm install -g --allow-root nodemon \
    && npm install -g --allow-root yarn

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
