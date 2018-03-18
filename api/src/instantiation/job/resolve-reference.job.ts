import { Component } from '@nestjs/common';
import { GithubClient } from '../github-client.component';
import { JobInterface, SourceJobInterface } from './job';
import { JobExecutorInterface } from './job-executor';

export class ResolveReferenceJob implements SourceJobInterface {

    constructor(
        readonly source: any,
    ) {}

}

@Component()
export class ResolveReferenceJobExecutor implements JobExecutorInterface {

    constructor(
        private readonly githubClient: GithubClient,
    ) {}

    supports(job: JobInterface): boolean {
        return (job instanceof ResolveReferenceJob);
    }

    execute(job: JobInterface, data: any): Promise<any> {
        if (!this.supports(job)) {
            throw new Error();
        }

        const sourceJob = job as ResolveReferenceJob;
        const {source} = sourceJob;

        return new Promise((resolve, reject) => {
            const {type, name, reference} = source.config;

            console.log(`Resolving reference to source ${name} of type ${reference.type} and name ${reference.name}.`);

            if (type !== 'github') {
                reject(new Error(`Source type ${type} not supported.`));

                return;
            }

            this.githubClient
                .getRepo(name)
                .then(
                    () => {
                        let commitPromise;

                        switch (reference.type) {
                            case 'tag':
                                commitPromise = this.githubClient.getTagCommit(name, reference.name);
                                break;

                            case 'branch':
                                commitPromise = this.githubClient.getBranchCommit(name, reference.name);
                                break;

                            case 'commit':
                                commitPromise = this.githubClient.getCommit(name, reference.name);
                                break;

                            default:
                                reject(new Error(`Reference type ${reference.type} not supported.`));

                                return;
                        }

                        commitPromise.then(
                            commit => {
                                const resolvedReference = {
                                    type: 'commit',
                                    repository: name,
                                    commit,
                                };
                                source.resolvedReference = resolvedReference;

                                resolve();
                            },
                            error => {
                                reject(error);
                            },
                        );
                    },
                    error => {
                        reject(error);
                    },
                );
        });
    }

}
