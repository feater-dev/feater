FROM nginx:1.13

RUN apt-get update \
    && apt-get install -y vim curl

ADD entrypoint.sh /entrypoint.sh
ADD default.conf /etc/nginx/conf.d/default.conf

CMD ["/entrypoint.sh"]
