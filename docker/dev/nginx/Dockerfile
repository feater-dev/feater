FROM nginx:1.13

WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
        vim \
        curl \
    && apt-get clean

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]

ADD default.conf /etc/nginx/conf.d/default.conf
