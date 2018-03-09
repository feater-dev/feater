const path = require('path');
const { spawn } = require('child_process');
const { EnvironmentalVariablesSet } = require('./../environmental-variables-set');

module.exports = function (jobClasses) {

    let { BuildJob, JobExecutor } = jobClasses;

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

                let commonEnvironmentalVariables = new EnvironmentalVariablesSet();
                commonEnvironmentalVariables.add('COMPOSE_PROJECT_NAME', `featbuild${build.hash}`);  // TODO Move pattern to config. Move value to build class.
                commonEnvironmentalVariables.add('COMPOSE_HTTP_TIMEOUT', 5000);
                commonEnvironmentalVariables.add('PATH', '/usr/local/bin/'); // TODO Move to config.

                console.log('Running docker-compose.');

                EnvironmentalVariablesSet.merge(build.environmentalVariables, commonEnvironmentalVariables).toObject();

                let dockerCompose = spawn(
                    'docker-compose', ['--file', dockerComposeFileName, 'up', '-d', '--no-color'],
                    {
                        cwd: dockerComposeDirectoryAbsolutePath,
                        env: EnvironmentalVariablesSet.merge(build.environmentalVariables, commonEnvironmentalVariables).toObject()
                    }
                );

                // let stdoutLogger = build.logger.createNested('compose stdout', { splitLines: true });
                dockerCompose.stdout.on('data', data => {
                    console.log(data.toString());
                    // stdoutLogger.debug(data.toString());
                });

                // let stderrLogger = build.logger.createNested('compose stderr', { splitLines: true });
                dockerCompose.stderr.on('data', data => {
                    console.log(data.toString());
                    // stderrLogger.error(data.toString());
                });

                dockerCompose.on('error', error => {
                    console.log(error);
                    reject(error);
                });

                dockerCompose.on('exit', code => {
                    if (0 !== code) {
                        console.log('Failed to run docker-compose.');
                        reject(code);

                        return;
                    }

                    resolve();
                });

                dockerCompose.on('close', code => {
                    if (0 !== code) {
                        console.log('Failed to run docker-compose.');
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
