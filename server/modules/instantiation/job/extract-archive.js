let fs = require('fs-extra');
let decompress = require('decompress');

module.exports = function (baseClasses) {

    let { ComponentInstanceJob, JobExecutor } = baseClasses;

    class ExtractArchiveJob extends ComponentInstanceJob {}

    class ExtractArchiveJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ExtractArchiveJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { componentInstance } = job;

                componentInstance.log('Extracting archive.');

                componentInstance.relativePath = componentInstance.id;
                decompress(componentInstance.zipFileFullPath, componentInstance.fullBuildPath, { strip: 1 })
                    .then(resolve)
                    .catch(error => {
                        componentInstance.log('Failed to extract archive.');
                        reject(error)
                    });
            });
        }
    }

    return {
        ExtractArchiveJob,
        ExtractArchiveJobExecutor
    };

};
