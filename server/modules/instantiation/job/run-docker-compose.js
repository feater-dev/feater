var _ = require('underscore');
var path = require('path');
var fs = require('fs-extra');
var { spawn } = require('child_process');

module.exports = function (baseClasses) {

    var { BuildInstanceJob, JobExecutor } = baseClasses;

    class RunDockerComposeJob extends BuildInstanceJob {}

    class RunDockerComposeJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof RunDockerComposeJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { buildInstance } = job;
                var dockerComposeDirectoryFullPath = path.join(
                    buildInstance.componentInstances[buildInstance.config.composeFile.componentId].fullBuildPath,
                    path.dirname(buildInstance.config.composeFile.relativePath)
                );
                var dockerComposeFileName = path.basename(buildInstance.config.composeFile.relativePath);
                var dockerComposeEnvironemntalVariables = _.extend(
                    {},
                    buildInstance.environmentalVariables,
                    {
                        COMPOSE_PROJECT_NAME: `featbuild${buildInstance.id}`,
                        COMPOSE_HTTP_TIMEOUT: 5000,
                        PATH: '/usr/local/bin/' // TODO Move to config.
                    }
                );

                buildInstance.log('Running docker-compose.');

                var dockerCompose = spawn(
                    'docker-compose', ['--file', dockerComposeFileName, 'up', '--abort-on-container-exit', '--no-color'],
                    {
                        cwd: dockerComposeDirectoryFullPath,
                        env: dockerComposeEnvironemntalVariables
                    }
                );

                var stdoutLogger = buildInstance.logger.createNested('docker-compose stdout', { splitLines: true });
                dockerCompose.stdout.on('data', (data) => {
                    stdoutLogger.debug(data.toString());
                });

                var stderrLogger = buildInstance.logger.createNested('docker-compose stderr', { splitLines: true });
                dockerCompose.stderr.on('data', (data) => {
                    stderrLogger.error(data.toString());
                });

                dockerCompose.on('error', (error) => {
                    reject(error);
                });

                dockerCompose.on('exit', (code) => {
                    reject(code);
                });

                dockerCompose.on('close', (code) => {
                    if (0 !== code) {
                        buildInstance.log('Failed to run docker-compose.');
                        reject(code);

                        return;
                    }

                    buildInstance.log('Succeeded to run docker-compose.');
                    resolve();
                });
            });
        }
    }

    return {
        RunDockerComposeJob,
        RunDockerComposeJobExecutor
    };

};
