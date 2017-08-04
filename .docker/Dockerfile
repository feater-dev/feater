FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install -y sudo curl python vim nano xterm unzip
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs \
    && npm install -g --allow-root npm@latest
RUN npm update -g --allow-root nvm
RUN apt-get install -y apt-transport-https ca-certificates curl software-properties-common
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
RUN apt-get update
RUN apt-get install -y docker-ce
RUN curl -o /usr/local/bin/docker-compose -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` \
    && chmod +x /usr/local/bin/docker-compose

WORKDIR /app

ADD entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]
