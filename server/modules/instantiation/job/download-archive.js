let path = require('path');
let fs = require('fs');
let mkdirRecursive = require('mkdir-recursive');
let { exec } = require('child_process');

const BUFFER_SIZE = 268435456; // 256M

module.exports = function (config, baseClasses) {

    let { ComponentInstanceJob, JobExecutor } = baseClasses;

    class DownloadArchiveJob extends ComponentInstanceJob {}

    class DownloadArchiveJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof DownloadArchiveJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { componentInstance, componentInstance: { buildInstance } } = job;

                componentInstance.log('Preparing repository archive.');

                let { repository, commit } = componentInstance.resolvedReference;
                let [ owner, name ] = repository.split('/');

                componentInstance.zipFileUrl = `https://api.github.com/repos/${repository}/zipball/${commit.sha}`;

                let zipFileDirPath = path.join(config.paths.repositoryCache, 'github', owner, name);

                if (!fs.existsSync(zipFileDirPath)) {
                    mkdirRecursive.mkdirSync(zipFileDirPath);
                }

                componentInstance.zipFileFullPath = path.join(zipFileDirPath, `${commit.sha}.zip`);

                // Check if archive for given repository and commit is already cached.
                // If so no need to download, just resolve this job.
                if (fs.existsSync(componentInstance.zipFileFullPath)) {
                    componentInstance.log('Archive already cached.');
                    resolve();

                    return;
                }

                // Otherwise download archive and keep it in repository cache.
                componentInstance.log('Downloading archive.');
                exec(
                    `curl -s -H "Authorization: token ${config.github.personalAccessToken}" -L ${componentInstance.zipFileUrl} > ${componentInstance.zipFileFullPath}`,
                    { maxBuffer: BUFFER_SIZE },
                    error => {
                        if (error) {
                            componentInstance.log(`Failed to download archive for GitHub repository ${repository} at commit ${commit.sha}.`);
                            reject(error);

                            return;
                        }
                        resolve();
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
