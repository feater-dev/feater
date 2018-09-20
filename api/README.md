# XSolve Feat API component

## Requirements
- Yarn
- NodeJS v8.10
- Docker CE v17.12.1
- Docker Compose v1.19.0

## Installation
- `yarn install`

## Run
- `yarn start:dev` - to serve development version
- `yarn start:dev:watch` - to serve development version and watch for changes


# How to

## Creating volumes from assets

It's possible to create named volumes from `.tar.gz` assets added to a project.

Such assets are decompressed and copied to a named volume (with temporary `alpine` container) and later can be attached to services based on configuration in `docker-compose.yml`.

Let's assume we have an asset named `lipsum` containing a `.tar.gz` file - it contains some documents we want to have available inside our `app` service container via mounted volume.

Respective entry in Feat definition configuration will look as follows:

```yaml
volumes:
  - id: lipsum_docs       # This is the id of provided named volume
                          # which can be used to determine it's full name.
    assetId: lipsum       # This has to correspond with asset id.
```

This will result in named volume being created, which name is prefixed to be unique accross all provided instances.

To mount this volume to `/lipsum` path in our service container we need to change our `docker-compose` configuration like this:

```yaml
version: '3.3'

services:

  app:
    build: app
    volumes:
      - lipsum_docs_internal:/lipsum

volumes:
  lipsum_docs_internal:
    external:
      name: ${FEAT__ASSET_VOLUME__LIPSUM_DOCS}
```

The full name of created volume is provided via `FEAT__ASSET_VOLUME__LIPSUM_DOCS` environmental variable. As you can see it's last part `LIPSUM_DOCS` corresponds to volume id `lipsum_docs_internal` that was used in Feat definition configuration before.

Asset volumes need to be specified in `volumes` section of `docker-compose.yml` as `external`. Since it's not possible to interpolate environmental variables in keys, we need to map external name to internal one.

Using `lipsum_docs_internal` as an internal volume name is completely arbitrary here and any other name could be used instead. Also the asset id, the external volume id and the internal volume id could all have the same value - different values are used here only to show how they are related to each other.

## Creating MySQL volumes from assets

A popular use case for named volumes created from assets would be prepopulating databases.

One approach would be to just copy asset (which in this case would be a database dump) into container and importing it during after build task. However this solutions results in database not being available immediately and will require more time as imported file needs to be processed by database server.

Better solution is to prepare data volume containing all files required for our database beforehand as it will be mounted immediately when `docker-compose` starts our services.

Let's assume we are using MySQL 5.7 database and that we will be using [datacharmer/test_db](https://github.com/datacharmer/test_db) as our sample database.

First we need to create `.tar.gz` file that we can upload to Feat later. We can use standalony MySQL container for this. Let's assume we have the sample database checked out in `/home/me/test_db`. We will start with a simple `docker-compose.yml`:

```yaml
version: '3.3'

services:

  db:
    image: mysql:5.7
    container_name: test_db_temp
    volumes:
      - /home/me/test_db:/data
    environment:
      MYSQL_RANDOM_ROOT_PASSWORD: "yes"
      MYSQL_USER: "user"
      MYSQL_PASSWORD: "pass"
      MYSQL_DATABASE: "employees"
```

We will run it with `docker-compose up -d` and then we'll enter the container and run `bash` in it:

```bash
docker exec -it test_db_temp bash
```

Inside the container we will execute following commands:

```bash
cd /data
mysql -uuser -ppass < employees.sql
cd /var/lib/mysql
tar -czvf /data/volume.tar.gz *
```

Now we can exit the container and create in Feat an asset with id `test_db_asset` and `/home/me/test_db/volume.tar.gz` as uploaded file.

Our Feat definition configuration would include following section:

```yaml
volumes:
  - id: test_db
    assetId: test_db_asset
```

Corresponding `docker-compose.yml` may look like this:

```yaml
version: '3.3'

services:

  # Some application containers here.

  db:
    image: mysql:5.7
    volumes:
      - test_db_internal:/var/lib/mysql
    environment:
      MYSQL_RANDOM_ROOT_PASSWORD: "yes"
      MYSQL_USER: "user"
      MYSQL_PASSWORD: "pass"
      MYSQL_DATABASE: "employees"

volumes:
  test_db_internal:
    external:
      name: ${FEAT__ASSET_VOLUME__TEST_DB}
```

Note that values of environment variables related to MySQL credentials need to remain the same, because they are also included in the asset we've created.
