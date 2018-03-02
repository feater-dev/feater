module.exports = function (jobClasses, githubApiClient) {

    let { SourceJob, JobExecutor } = jobClasses;

    class ResolveReferenceJob extends SourceJob {}

    class ResolveReferenceJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ResolveReferenceJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                let { source } = job;
                let { type, name, reference } = source.config;

                if (type !== 'github') {
                    reject(new Error(`Source type ${type} not supported.`));

                    return;
                }

                source.log(`Resolving reference to source ${name} of type ${reference.type} and name ${reference.name}.`);

                githubApiClient
                    .getRepo(name)
                    .then(
                        () => {
                            var commitPromise;

                            switch (reference.type) {
                                case 'tag':
                                    commitPromise = githubApiClient.getTagCommit(name, reference.name);
                                    break;

                                case 'branch':
                                    commitPromise = githubApiClient.getBranchCommit(name, reference.name);
                                    break;

                                case 'commit':
                                    commitPromise = githubApiClient.getCommit(name, reference.name);
                                    break;

                                default:
                                    reject(new Error(`Reference type ${reference.type} not supported.`));

                                    return;
                            }

                            commitPromise.then(
                                commit => {
                                    var resolvedReference = {
                                        type: 'commit',
                                        repository: name,
                                        commit: commit
                                    };
                                    job.source.resolvedReference = resolvedReference;
                                    job.setResult({ resolvedReference });

                                    resolve();
                                },
                                error => {
                                    reject(error);
                                }
                            );
                        },
                        error => {
                            reject(error);
                        }
                    );
            });
        }
    }

    return {
        ResolveReferenceJob,
        ResolveReferenceJobExecutor
    };

};
