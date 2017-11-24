module.exports = function (baseClasses, githubApiClient) {

    var { ComponentInstanceJob, JobExecutor } = baseClasses;

    class ResolveReferenceJob extends ComponentInstanceJob {}

    class ResolveReferenceJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof ResolveReferenceJob);
        }

        execute(job) {
            return new Promise((resolve, reject) => {
                var { componentInstance } = job;
                var { source, reference } = componentInstance.config;
                if (!source || !reference) {
                    reject(Error('Missing source or reference.'));

                    return;
                }
                if (source.type !== 'github') {
                    reject(new Error(`Source type ${source.type} not supported.`));

                    return;
                }

                componentInstance.log(`Resolving reference to source ${source.name} of type ${reference.name} and name ${reference.name}.`);

                githubApiClient
                    .getRepo(source.name)
                    .then(
                        () => {
                            var commitPromise;

                            switch (reference.type) {
                                case 'tag':
                                    commitPromise = githubApiClient.getTagCommit(source.name, reference.name);
                                    break;

                                case 'branch':
                                    commitPromise = githubApiClient.getBranchCommit(source.name, reference.name);
                                    break;

                                case 'commit':
                                    commitPromise = githubApiClient.getCommit(source.name, reference.name);
                                    break;

                                default:
                                    reject(new Error(`Reference type ${reference.type} not supported.`));

                                    return;
                            }

                            commitPromise.then(
                                commit => {
                                    var resolvedReference = {
                                        type: 'commit',
                                        repository: source.name,
                                        commit: commit
                                    };
                                    job.componentInstance.resolvedReference = resolvedReference;
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
