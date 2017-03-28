FROM node:7.4.0

ADD entrypoint.sh /entrypoint.sh

RUN chmod 755 /*.sh
RUN npm install -g yarn
RUN yarn global add @angular/cli

WORKDIR /app

CMD ["/entrypoint.sh"]
