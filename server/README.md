# Feater API component

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

## How to

### Creating volumes from assets

It's possible to create named volumes from `.tar.gz` assets added to a project.

Such assets are decompressed and copied to a named volume (with temporary `alpine` container) and later can be attached to services based on configuration in `docker-compose.yml`.

Let's assume we have an asset named `lipsum` containing a `.tar.gz` file - it contains some documents we want to have available inside our `app` service container via mounted volume.

Respective entry in Feater definition configuration will look as follows:

```yaml
asset_volumes:
  - id: lipsum_docs       # This is the id of provided named volume
                          # which can be used to determine it's full name.
    asset_id: lipsum      # This has to correspond with asset id.```

This will result in named volume being created, which name is prefixed to be unique across all provided instances.

To mount this volume to `/lipsum` path in our service container we need to change our `docker-compose` configuration like this:

```yaml
version: '3.3'

services:

  app:
    build: app
    volumes:
      - "lipsum_docs_internal:/lipsum"

volumes:
  lipsum_docs_internal:
    external:
      name: ${FEATER__ASSET_VOLUME__LIPSUM_DOCS}
```

The full name of created volume is provided via `FEATER__ASSET_VOLUME__LIPSUM_DOCS` environmental variable. As you can see it's last part `LIPSUM_DOCS` corresponds to volume id `lipsum_docs_internal` that was used in Feater definition configuration before.

Asset volumes need to be specified in `volumes` section of `docker-compose.yml` as `external`. Since it's not possible to interpolate environmental variables in keys, we need to map external name to internal one.

Using `lipsum_docs_internal` as an internal volume name is completely arbitrary here and any other name could be used instead. Also the asset id, the external volume id and the internal volume id could all have the same value - different values are used here only to show how they are related to each other.

### Creating MySQL volumes from assets
