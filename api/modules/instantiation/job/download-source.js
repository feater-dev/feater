let path = require('path');
let fs = require('fs');
let mkdirRecursive = require('mkdir-recursive');
let { exec } = require('child_process');

const BUFFER_SIZE = 268435456; // 256M

module.exports = function (config, jobClasses) {

    let { SourceJob, JobExecutor } = jobClasses;

    class DownloadSourceJob extends SourceJob {}

    class DownloadSourceJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof DownloadSourceJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { source } = job;

                console.log('Preparing source.');

                let { repository, commit } = source.resolvedReference;
                let [ owner, name ] = repository.split('/');

                source.zipFileUrl = `https://api.github.com/repos/${repository}/zipball/${commit.sha}`;

                let zipFileDirPath = path.join(config.guestPaths.repositoryCache, 'github', owner, name);

                if (!fs.existsSync(zipFileDirPath)) {
                    mkdirRecursive.mkdirSync(zipFileDirPath);
                }

                source.zipFileFullPath = path.join(zipFileDirPath, `${commit.sha}.zip`);

                // Check if given source is already cached.
                // If so no need to download, just resolve this job.
                if (fs.existsSync(source.zipFileFullPath)) {
                    console.log('Source already cached.');
                    resolve();

                    return;
                }

                // Otherwise download source and keep it in cache.
                console.log('Downloading source.');
                exec(
                    `curl -s -H "Authorization: token ${config.github.personalAccessToken}" -L ${source.zipFileUrl} > ${source.zipFileFullPath}`,
                    { maxBuffer: BUFFER_SIZE },
                    error => {
                        if (error) {
                            console.log(`Failed to download source from GitHub repository ${repository} at commit ${commit.sha}.`);
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
        DownloadSourceJob,
        DownloadSourceJobExecutor
    };

};
