let _ = require('underscore');
let path = require('path');
let fs = require('fs');
let jsYaml = require('js-yaml');

module.exports = function (config, jobClasses, buildRepository) {

    let { BuildJob, JobExecutor } = jobClasses;

    class ParseDockerComposeJob extends BuildJob {}

    class ParseDockerComposeJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ParseDockerComposeJob);
        }

        execute(job) {
            return new Promise(resolve => {
                let { build } = job;

                console.log('Parsing compose file.');

                let absoluteDir = path.join(
                    build.sources[build.config.composeFile.sourceId].fullBuildPath,
                    path.dirname(build.config.composeFile.relativePath)
                );
                let basename = path.basename(build.config.composeFile.relativePath);

                build.compose = jsYaml.safeLoad(
                    fs.readFileSync(path.join(absoluteDir, basename)).toString()
                );

                build.composeProjectName = `featbuild${build.hash}`;

                build.services = {};
                _.each(
                    build.compose.services,
                    (service, id) => {
                        // Keep only letters, digits and hyphens in clean name for domains.
                        // Replace other characters with hyphens.

                        build.services[id] = {
                            id,
                            cleanId: id.replace(/[^a-zA-Z\d-]/g, '-').toLowerCase(),
                            containerNamePrefix: `${build.composeProjectName}_${id}`,
                            exposedPorts: []
                        };
                    }
                );

                buildRepository.updateServices(build);

                resolve();

            });
        }
    }

    return {
        ParseDockerComposeJob,
        ParseDockerComposeJobExecutor
    };

};
