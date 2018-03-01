var _ = require('underscore');
var path = require('path');
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
                let { buildInstance } = job;

                let dockerComposeDirectoryAbsolutePath = path.join(
                    buildInstance.componentInstances[buildInstance.config.composeFile.componentId].fullBuildPath,
                    path.dirname(buildInstance.config.composeFile.relativePath)
                );

                let dockerComposeFileName = path.basename(buildInstance.config.composeFile.relativePath);

                let dockerComposeEnvironemntalVariables = _.extend(
                    {},
                    buildInstance.environmentalVariables,
                    {
                        COMPOSE_PROJECT_NAME: `featbuild${buildInstance.shortid}`,  // TODO Move to config.
                        COMPOSE_HTTP_TIMEOUT: 5000,
                        PATH: '/usr/local/bin/' // TODO Move to config.
                    }
                );

                buildInstance.log('Running docker-compose.');

                let dockerCompose = spawn(
                    'docker-compose', ['--file', dockerComposeFileName, 'up', '-d', '--no-color'],
                    {
                        cwd: dockerComposeDirectoryAbsolutePath,
                        env: dockerComposeEnvironemntalVariables
                    }
                );

                let stdoutLogger = buildInstance.logger.createNested('compose stdout', { splitLines: true });
                dockerCompose.stdout.on('data', data => {
                    stdoutLogger.debug(data.toString());
                });

                let stderrLogger = buildInstance.logger.createNested('compose stderr', { splitLines: true });
                dockerCompose.stderr.on('data', data => {
                    stderrLogger.error(data.toString());
                });

                dockerCompose.on('error', error => {
                    reject(error);
                });

                dockerCompose.on('exit', code => {
                    if (0 !== code) {
                        buildInstance.log('Failed to run docker-compose.');
                        reject(code);

                        return;
                    }

                    resolve();
                });

                dockerCompose.on('close', code => {
                    if (0 !== code) {
                        buildInstance.log('Failed to run docker-compose.');
                        reject(code);

                        return;
                    }

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
