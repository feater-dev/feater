# Supported tags

* latest-docker-latest,
  latest-docker-18.09.2,
  latest-docker-18.06.3

# Quick reference

* Source code and where to file issues:
  [http://github.com/boldare/feater]

* Example project that can be easily run with Feater:
  [https://github.com/boldare/feater-symfony-example]

# Introduction

**Feater** is a tool for rapid deployment of selected features of your web
application to isolated testing or demo environments.

**It’s tech-agnostic.**
It can be used regardless of languages or dependencies used in your project.
This is possible because it uses Docker containers and Docker Compose
configurations.

**It’s open-source.**
It's released under MIT license. You can use it for free as well as modify it to
suit your needs.

**It’s easy to use.**
If your project has a Docker Compose setup and some build scripts you won't need
much more to run it with Feater.

**It’s easy to host.**
It runs in Docker containers and you can use it on your local machine or set up
a dedicated server for it.

# How to use this image

## Prerequisites

The only requirement for using Feater is that Docker is installed on your
machine. Before running Feater you should check Docker version installed on your
machine to use the image matching it:

```bash
$ docker --version
Docker version 18.06.0-ce, build 0ffa825
```

In this case image `feater:*-docker-18.06.3` should be used.

You also need to create Docker network that will be used to expose some of the
instantiated services:

```bash
$ docker network create feater_proxy
```

## Basic usage

If you want to try out Feater you can run it without mounting any volumes for
persisting data. Be aware that in this case after removing its container all
data will be lost. See following sections to find out how data can be persisted
independently of Feater container.

When running Feater it is necessary to:

* mount Docker socket at `/var/run/docker.sock`;

* provide Docker proxy network name using `FEATER_PROXY_NETWORK_NAME`
  environmental variable;

* map port 9010 where Feater UI is available;

* map port 9011 where instantiated services are proxied.

Assuming port 80 is not in use on your machine following command can be used:

```bash
$ docker run \
    -p 9010:9010 \
    -p 80:9011 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -e FEATER_PROXY_NETWORK_NAME=feater_proxy \
    -d \
    --name feater \
    feater:latest-docker-18.06.3
```

You can now access Feater's UI at `http://localhost:9010`.

Instantiated services will be proxied using domain names following pattern
`{instance_hash}-{port_id}.featerinstance.localhost` and balanced using Nginx on
port 9011 of the Feater container, which is now mapped to `localhost`'s port 80.
In this case you should be able to access them in your web browser without any
additional configuration.

## Usage with persistent data

Inside Feater container data are persisted in following directories:

* `/data/asset` - stores uploaded assets;

* `/data/build` - temporarily stores sources before they are copied to volumes;

* `/data/identity` - stores private parts of deploy keys that are used to clone
  private repositories over SSH;

* `/data/mongo` - stores data persisted in MongoDB about projects, definitions,
  assets, instances, deploy keys, logs; instead of MongoDB installed inside
  Feater container external MongoDB can be used;

* `/data/proxy` - stores Nginx configurations for proxied instantiated services.

In case you want to persist these information even if Feater container is
removed mount some volumes to paths listed above, or simply to `/data` path:

```bash
$ docker volume create feater_data

$ docker run \
    -p 9010:9010 \
    -p 80:9011 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v feater_data:/data \
    -e FEATER_PROXY_NETWORK_NAME=feater_proxy \
    -d \
    --name feater \
    feater:latest-docker-18.06.3
```

## Environment variables

### Controlling location of persistent data

* `FEATER_GUEST_PATH_ASSET` - defaults to `/data/asset`;

* `FEATER_GUEST_PATH_BUILD` - defaults to `/data/build`;

* `FEATER_GUEST_PATH_IDENTITY` - defaults to `/data/identity`;

* `FEATER_GUEST_PATH_PROXY` - defaults to `/data/proxy`.

### Controlling Docker Compose version

* `FEATER_DOCKER_COMPOSE_VERSION` - defaults to `1.23.2`.

### Controlling instantiation

* `FEATER_CONTAINER_NAME_PREFIX` - the prefix that will be used for generating
  `COMPOSE_PROJECT_NAME` for instantiated services; note that some versions of
  Docker will remove all characters other that letters and digits; if your
  version of Docker allows to use underscore it is convenient to append it to
  the end of this prefix; defaults to `featerinstance`;

* `FEATER_PROXY_DOMAIN_PATTERN` - the pattern for proxy domains generated for
  instantiated services; tokens `{instance_hash}` and `{port_id}` will be
  replaced with values specific for given instance and proxied port; defaults to
  `{instance_hash}-{port_id}.featerinstance.localhost`;

* `FEATER_PROXY_NETWORK_NAME` - the name of the Docker network to which all
  proxied instantiated services are connected after being run; defaults to
  `feater_proxy`.

### Controlling log level

* `FEATER_LOG_LEVEL_CONSOLE` - specifies log level that will be outputed to
  console; defaults to `info`;

* `FEATER_LOG_LEVEL_MONGO` - specifies log level that will be persisted in
  MongoDB; defaults to `info`.

# Recommendations

For inspecting containers run with Feater you can use
[Portainer](https://www.portainer.io/).
