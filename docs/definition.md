# Definition schema

This section discusses the Yaml schema you can use for creating, importing or exporting Feater definitions. Yaml format was chosen for definition files due to its high readability, as well as the ability to include comments.

All settings described below may be also provided via UI. The values in respective form can also be prepopulated with values from Yaml and  adjusted manually afterwards.

The examples are based on Symfony example app, available at [xsolve-pl/feater-symfony-example](https://github.com/xsolve-pl/feater-symfony-example). The full definition can be found at [.feater/definition.yml](https://github.com/xsolve-pl/feater-symfony-example/blob/master/.feater/definition.yml).

## Sources

This section allows you to define a list of repositories containing sources required for instance. They will be cloned and specified commits will be checked out for them.

Additionally you can define some simple alterations that should be done to these sources before services are started - typically copying some configuration files or substituting some values they contain.

Here is an example of this section with a single source specified:

```yml
sources:
- id: symfony_example
  clone_url: "https://github.com/xsolve-pl/feater-symfony-example.git"
  reference:
    type: branch
    name: master
  before_build_tasks:
  - type: copy
    source_relative_path: "app/config/parameters.yml.feater.dist"
    destination_relative_path: "app/config/parameters.yml"
  - type: interpolate
    relative_path: "app/config/parameters.yml"
  - type: copy
    source_relative_path: "web/app_dev.php.dist"
    destination_relative_path: "web/app_dev.php"
```

Each source needs to be given a unique ID which will be used later to generate:

- environmental variables `FEATER__HOST_SOURCE_PATH__{id}` and `FEATER__GUEST_SOURCE_PATH__{id}`, where  `{id}` part is replaced with uppercase version of `id` provided in definition; these variables are set to absolute paths to the directory where given source is checked out, with `HOST` path being a path on host machine on which Feater API container is running, and `GUEST` path being a path on Feater API container; if Feater is not run inside container then these path are equal; **TODO Give some example here or in configuration guidelines**
- substitution variables `host_source_path____{id}` and `guest_source_path__{id}`, where  `{id}` part is replaced with lowercase version of `id` provided in definition; the meaning of `host` and `guest` is the same as for environmental variables.

**TODO Maybe add some more variables (reference type, reference name, resulting commit hash)**

### Repository

To specify repository that should be cloned you should provide following values:

- `clone_url` - a URL that should be used to clone repository; depending on whether the repository is public or private you should use different protocol:
  - for public repository you should provide a URL with HTTPS protocol (e.g. `https://github.com/xsolve-pl/feater-symfony-example.git`); no authentication is required in this case to clone the repository;
  - for private repository you should provide a URL with SSH protocol (e.g. `git@github.com:xsolve-pl/feater-symfony-example.git`); in this case Feater will generate SSH deploy key that you will need to add in repository settings before attempting to create an instance;
- `reference.type` - a type of reference that will be provided in `reference.name`; currently the only supported type is `branch`;
- `reference.name` - a name of specific reference; for type set to `branch` this will be the name of the branch that should be checked out.

For the example given above public repository `https://github.com/xsolve-pl/feater-symfony-example` is cloned and it's `master` branch is checked out.

### Tasks to run before build

To define alterations that should be done to source files prior to running services you should use `before_build_tasks` part of `sources` section. For each source you can define a list of tasks that will be executed in sequence. Currently supported tasks include copying a file or replacing substitution variables in a file.

#### Copying files

For this type of task you need to set `type` to `copy` and specify:

- `source_relative_path` - a path to source file, relative to repository root,
- `destination_relative_path` - a destination path, relative to repository root.

For the example given above  `app/config/parameters.yml.feater.dist` file is copied to `app/config/parameters.yml`.

#### Replacing substitution variables in files

For this type of task you need to set `type` to `inetrpolate` and specify:

- `relative_path` - a path to file that should be interpolated, relative to repository root.

For the example given above substitution variables are interpolated in file `app/config/parameters.yml` which was previously copied.

##### Substitution tokens

**TODO Where user can find a list of available substitution variables (with ot without values)?**

The delimiters for substitution tokens are `{{{` and `}}}`.

To give an example, if you want to provide a proxy domain generated for service port identified as `foo` to some configuration file, your configuration file should include a token `{{{proxy_domain__foo}}}`. This will be replaced with value like `http://{instance_hash}-foo.my-feater-host/` where `{instance_hash}` will be replaced with 8-letter hash generated for given instance (assuming that the value you provided in configuration for `instantiation.proxyDomainPattern` is `{instance_hash}-{port_id}.my-feater-host`).

## Volumes

This section allows you to define a list of Docker volumes that will be prepopulated with data from specified assets and will be mounted to selected services defined in `docker-compose` configuration.

Here is an example of this section with a single volume specified:

```yml
volumes:
- id: test_db
  asset_id: test_db_volume
```

In each entry a new volume is defined by specifying:

-  `id` - ID that the volume will be referenced with,
- `asset_id` - ID of the asset that should be used to prepopulate volume with data.

Note that the volume ID provided here is **not** the volume ID used by Docker. The latter is generated automatically and prefixed for each instance to avoid conflicts. It is then made available via:

- environmental variable named  `FEATER__ASSET_VOLUME__{id}`, where  `{id}` part is replaced with uppercase version of `id` provided in definition; this allows them to be added to `docker-compose` configuration as external volumes and mount them to selected services;
- substitution variable named `asset_volume__{id}`, where  `{id}` part is replaced with lowercase version of `id` provided in definition.

Referenced asset needs to be `.tar.gz` archive. It will be decompressed to prepopulate the volume. In example above we assume that asset with ID `test_db_volume` is available and it is a `tar.gz` archive.

### Preparing asset for prepopulated volume

**TODO Describe how assets for volumes should be created, use existing documentation**

### Making prepopulated volume available for services

Te example given above will make available:

- environmental variable `FEATER__ASSET_VOLUME__TEST_DB`,
- substitution variable named `asset_volume__test_db`.

The value of both will be set to value `featerinstance{instance_hash}_test_db`, where `{instance_hash}` is replaced with 8-letter hash generated for given instance.

To mount this volume to one of services defined in `docker-compose` configuration you should include following information in it:

```yml
version: "3"

services:

  # ...

  symfony_db:
    # ...
    volumes:
      - "test_db:/var/lib/mysql"

volumes:
  test_db:
    external:
      name: "$FEATER__ASSET_VOLUME__TEST_DB"
```

This way volume ID provided in  `FEATER__ASSET_VOLUME__TEST_DB` environmental variable is mapped internally to `test_db` and as such is mounted to `symfony_db` service at `/var/lib/mysql`.

## Proxied ports

### Example

```yml
proxied_ports:
- id: sf
  service_id: symfony_app
  port: 8000
  name: Symfony application
- id: mail
  service_id: symfony_mailcatcher
  port: 1080
  name: Mailcatcher

- id: adminer
  service_id: symfony_adminer
  port: 8080
  name: Adminer
```

## Environmental variables

### Example

```yml
env_variables:
- name: SYMFONY_ENV
  value: dev
- name: DATABASE_USER
  value: user
- name: DATABASE_PASSWORD
  value: pass
- name: DATABASE_NAME
  value: employees
```

## Compose files

### Example

```yml
compose_files:
- source_id: symfony_example
  env_dir_relative_path: .docker
  compose_file_relative_paths:
  - ".docker/docker-compose.base.yml"
  - ".docker/docker-compose.feater.yml"
```

## Tasks to be run after build

### Example

```yml
afterBuildTasks:
- type: executeServiceCommand
  id: filesystem_acl
  service_id: symfony_app
  inherited_env_variables: []
  custom_env_variables: []
  command: ["bash", "-c", "./scripts/filesystem-acl.sh"]
- type: executeServiceCommand
  depends_on:
  - filesystem_acl
  service_id: symfony_app
  inherited_env_variables: []
  custom_env_variables: []
  command: ["bash", "-c", "./scripts/build.sh"]
```

## Summary items

### Example

```yml
summary_items:
- name: Symfony is app available at
  value: http://{{{proxy_domain__sf}}}
- name: Mailcatcher is available at
  value: http://{{{proxy_domain__mail}}}
- name: Adminer is available at
  value: http://{{{proxy_domain__adminer}}}
```

