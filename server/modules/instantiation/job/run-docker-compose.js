var _ = require('underscore');
var path = require('path');
var { spawn } = require('child_process');

module.exports = function (jobClasses) {

    var { BuildJob, JobExecutor } = jobClasses;

    class RunDockerComposeJob extends BuildJob {}

    class RunDockerComposeJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof RunDockerComposeJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { build } = job;

                let dockerComposeDirectoryAbsolutePath = path.join(
                    build.sources[build.config.composeFile.sourceId].fullBuildPath,
                    path.dirname(build.config.composeFile.relativePath)
                );

                let dockerComposeFileName = path.basename(build.config.composeFile.relativePath);

                let dockerComposeEnvironemntalVariables = _.extend(
                    {},
                    build.environmentalVariables,
                    {
                        COMPOSE_PROJECT_NAME: `featbuild${build.shortid}`,  // TODO Move to config.
                        COMPOSE_HTTP_TIMEOUT: 5000,
                        PATH: '/usr/local/bin/' // TODO Move to config.
                    }
                );

                build.log('Running docker-compose.');

                let dockerCompose = spawn(
                    'docker-compose', ['--file', dockerComposeFileName, 'up', '-d', '--no-color'],
                    {
                        cwd: dockerComposeDirectoryAbsolutePath,
                        env: dockerComposeEnvironemntalVariables
                    }
                );

                let stdoutLogger = build.logger.createNested('compose stdout', { splitLines: true });
                dockerCompose.stdout.on('data', data => {
                    stdoutLogger.debug(data.toString());
                });

                let stderrLogger = build.logger.createNested('compose stderr', { splitLines: true });
                dockerCompose.stderr.on('data', data => {
                    stderrLogger.error(data.toString());
                });

                dockerCompose.on('error', error => {
                    reject(error);
                });

                dockerCompose.on('exit', code => {
                    if (0 !== code) {
                        build.log('Failed to run docker-compose.');
                        reject(code);

                        return;
                    }

                    resolve();
                });

                dockerCompose.on('close', code => {
                    if (0 !== code) {
                        build.log('Failed to run docker-compose.');
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
