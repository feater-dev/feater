let decompress = require('decompress');

module.exports = function (jobClasses) {

    let { SourceJob, JobExecutor } = jobClasses;

    class ExtractSourceJob extends SourceJob {}

    class ExtractSourceJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ExtractSourceJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { source } = job;

                console.log('Extracting source.');

                source.relativePath = source.id;
                decompress(source.zipFileFullPath, source.fullBuildPath, { strip: 1 })
                    .then(resolve)
                    .catch(error => {
                        console.log('Failed to extract source.');
                        reject(error)
                    });
            });
        }
    }

    return {
        ExtractSourceJob,
        ExtractSourceJobExecutor
    };

};
