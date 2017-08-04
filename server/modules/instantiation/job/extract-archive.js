var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');
var { exec } = require('child_process');

module.exports = function (
    baseClasses
) {

    var { ComponentInstanceJob, JobExecutor } = baseClasses;

    const BUFFER_SIZE = 64 * 1024 * 1024;

    class ExtractArchiveJob extends ComponentInstanceJob {}

    class ExtractArchiveJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ExtractArchiveJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { componentInstance, componentInstance: { buildInstance } } = job;
                var extractedFullPath = path.join(
                    buildInstance.fullBuildPath,
                    path.basename(componentInstance.zipFileFullPath, '.zip')
                );

                componentInstance.relativePath = componentInstance.id;

                componentInstance.log('Extracting archive.');
                exec(
                    [
                        `unzip ${componentInstance.zipFileFullPath} -d ${buildInstance.fullBuildPath}`,
                        `mv ${extractedFullPath} ${componentInstance.fullBuildPath}`,
                        `rm ${componentInstance.zipFileFullPath}`
                    ].join(' && '),
                    { maxBuffer: BUFFER_SIZE },
                    (error) => {
                        if (error) {
                            componentInstance.log('Failed to extract archive.');
                            reject(error);

                            return;
                        }
                        componentInstance.log('Succeeded to extract archive.');

                        resolve();
                    }
                );
            });
        }
    }

    return {
        ExtractArchiveJob,
        ExtractArchiveJobExecutor
    };

};
