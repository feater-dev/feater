# Definition

Definition has multiple properties that we will discuss based on
add/duplicate definition form.

## Name

It is used as a label for definition on lists and in instance details
view.

## Sources
A list of sections specifying repositories should be cloned in order to
create an instance.

Following properties need to be defined for each of these sections:

- **ID** - will be used to generate paths and to reference given source
  later;

- **clone URL** - specifies where given repository is located; if it’s
  using HTTPS protocol it is assumed that the repository is public and
  no SSH deploy key is needed to clone it; otherwise a deploy key will
  be generated for each repository and should be added to it on
  GitHub/GitLLab/BitBucket;

- **source reference type and name** - specifies which revision should
  be checked out; in most cases you will use branch reference, but tag
  or commit are also available;

- **before build tasks** - a list of tasks that should be performed
  after source is cloned, but before Docker Compose setup is started;
  in most cases this will include preparing some config files (with Copy
  task) or replacing some values inside them (with Interpolate task);
  these tasks are executed in sequence, independently for each source;
  see _How tos_ section for a list of available interpolation
  placeholders.

## Volumes

A list of sections specifying if some assets should be used to
prepopulate external volumes with data; asset should be a .tar.gz
archive.

Following properties need to be defined for each of these sections:

- **ID** - will be used to generate paths, env variables names and to
  reference given volume later;

- **Asset ID** - specifies asset which should be used to prepopulate
  volume with data.

For more details on preparing this asset please see _How tos_ section.

## Proxied ports

A list of proxied ports specifying which service/container ports should
be proxied to externally available domains.

When preparing Docker Compose setup for Feater one cannot use exposed
ports as this would make building several instances impossible. Instead
one needs to specified in build definition which ports should be proxied
via Nginx running on feater_nginx container. Note that only HTTP
protocol (on port 80) is proxied.

Following properties need to be provided:

- **ID** - will be used to generate domain and env variable names;

- **name** - visible in UI when listing proxied ports;

- **service** - should reference one of services defined in Docker
  Compose setup;

- **proxied port** - the number of port to be proxied.

## Environmental variables

A list of sections specifying environmental variables that are used
instead of `.env` file when Docker Compose setup is run, along with some
additional env variables provided automatically by Feater (which names
are prefixed with `FEATER_`).

For each section you need to provide a name and a value of given env
variable. Keep in mind that values will be treated as strings regardless
of data they contain. Also note that these variables will not be
available inside container if they are not proxied (possibly under some
different names) in Docker Compose configuration file.

## Compose file

This section should specify in which source Docker Compose configuration
is located and which files should be used.

It  is possible to specify directory in which docker-compose commands
are to be executed, as well as the list of configuration files, both
relative to source root; multiple configuration files can be used.

## After build tasks

This section lists the tasks that should be performed after Docker
Compose setup for given instance is run. There are few types of tasks
available, but the one used most often is execute service command, which
allows to run specified command on selected service/container.

Following properties need to be provided:
- **ID** \[optional] - can be used to define the order of after build
  tasks;

- **Depends on** \[optional] - can be used to list IDs of other after
  build tasks that need to be executed before given after build task
  should be executed;

- other properties dependent on the type of given task; in case of
  executing service command we need to specify the service, command to
  be executed with it’s arguments; command will be executed in the
  working directory of given service;

If applicable you are also able to define some environmental variables
in two ways:

- either explicitly by using custom env variables section, where you
  provide list of names and values of env variables to be available when
  command is run;

- or by inheriting some variables by using inherited env variables
  section where you can reuse values of some variable provided in main
  environmental variables section, or (more probably) some env variables
  provided by Feater; you can also replace names of these variables by
  using aliases;

Here is an example of using environmental variables to execute one of
service commands.

**TODO Add example here.**

**TODO Update examples below.**

In this case:

- we are setting a custom env variable `FOO1` to
  `true`,

- we are allowing command to use some of the variables provided in
  definition configuration (`FOO2`, `FOO3`, `FOO4`, `FOO5`); in this
  case we are not changing their names but we could do it by providing
  different names in alias fields;

- we are also allowing command to use some of the variables generated by
  Feater, again without changing their names (`FOO6`, `FOO7`);

## Summary items

A list of sections specifying items to be shown in build summary,
typically for exposing some of the values generated internally as
Feater, like proxied domains, database DSNs etc.

Available placeholders that will be interpolated are the same as for
interpolate before build task. See How tos section for a list of these.

## Yaml format to import and export definition

All definition properties except for name can be imported or exported
using Yaml format.

Once definition is created you can get it’s configuration by checking
Configuration tab. When you want to create a new definition you can
click Import from Yaml button below the name, paste configuration into
textarea that appears below and click Import button to prepopulate the
form.
