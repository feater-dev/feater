var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');
var { exec } = require('child_process');

module.exports = function (
    config,
    baseClasses
) {

    var { ComponentInstanceJob, JobExecutor } = baseClasses;

    const BUFFER_SIZE = 64 * 1024 * 1024;

    class DownloadArchiveJob extends ComponentInstanceJob {}

    class DownloadArchiveJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof DownloadArchiveJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { componentInstance, componentInstance: { buildInstance } } = job;
                var { repository, commit } = componentInstance.resolvedReference;
                var zipFileUrl = `https://api.github.com/repos/${repository}/zipball/${commit.sha}`;
                var zipFileFullPath = path.join(buildInstance.fullBuildPath, `${repository.replace('/', '-')}-${commit.sha}.zip`);

                componentInstance.zipFileUrl = zipFileUrl;
                componentInstance.zipFileFullPath = zipFileFullPath;

                componentInstance.log(`Downloading archive for repository ${repository} at commit ${commit.sha}.`);
                exec(
                    `curl -s -H "Authorization: token ${config.github.personalAccessToken}" -L ${zipFileUrl} > ${zipFileFullPath}`,
                    { maxBuffer: BUFFER_SIZE },
                    (error) => {
                        if (error) {
                            componentInstance.log('Failed to download archive.');
                            reject(error);

                            return;
                        }
                        componentInstance.log('Succeeded to download archive.');

                        resolve({
                            zipFileUrl,
                            zipFileFullPath
                        });
                    }
                );
            });
        }
    }

    return {
        DownloadArchiveJob,
        DownloadArchiveJobExecutor
    };

};
