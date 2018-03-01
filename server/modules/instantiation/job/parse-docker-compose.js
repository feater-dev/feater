let _ = require('underscore');
let path = require('path');
let fs = require('fs');
let { spawn } = require('child_process');
let jsYaml = require('js-yaml');

module.exports = function (config, baseClasses, buildInstanceRepository) {

    let { BuildInstanceJob, JobExecutor } = baseClasses;

    class ParseDockerComposeJob extends BuildInstanceJob {}

    class ParseDockerComposeJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ParseDockerComposeJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { buildInstance } = job;

                buildInstance.log('Parsing compose file.');

                let absoluteDir = path.join(
                    buildInstance.componentInstances[buildInstance.config.composeFile.componentId].fullBuildPath,
                    path.dirname(buildInstance.config.composeFile.relativePath)
                );
                let basename = path.basename(buildInstance.config.composeFile.relativePath);

                buildInstance.compose = jsYaml.safeLoad(
                    fs.readFileSync(path.join(absoluteDir, basename)).toString()
                );

                buildInstance.composeProjectName = `featbuild${buildInstance.shortid}`;

                buildInstance.services = {};
                _.each(
                    buildInstance.compose.services,
                    (service, id) => {
                        // Keep only letters, digits and hyphens in clean name for domains.
                        let cleanId = id.replace(/[^a-zA-Z\d-]/g, '-').toLowerCase();

                        buildInstance.services[id] = {
                            id,
                            cleanId,
                            containerNamePrefix: `${buildInstance.composeProjectName}_${id}`,
                            exposedPorts: []
                        };
                    }
                );

                buildInstanceRepository.updateServices(buildInstance);

                resolve();

            });
        }
    }

    return {
        ParseDockerComposeJob,
        ParseDockerComposeJobExecutor
    };

};
