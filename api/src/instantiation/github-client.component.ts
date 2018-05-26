import * as _ from 'lodash';
import * as OctokitRest from '@octokit/rest';
import {Component} from '@nestjs/common';
import {Config} from '../config/config.component';
import {BaseLogger} from '../logger/base-logger';

@Component()
export class GithubClient {

    private readonly ocktokit;

    constructor(
        private readonly config: Config,
        private readonly logger: BaseLogger,
    ) {
        this.ocktokit = new OctokitRest({
            headers: {
                'user-agent': 'XSolve Feat',
            },
            timeout: 20000,
        });
    }

    getRepo(repoFullName): Promise<any> {
        this.authenticate();

        return this.ocktokit
            .repos
            .get(this.addRepoFullNameToParams({}, repoFullName))
            .catch(this.handleError);
    }

    getCommit(repoFullName, commitSha): Promise<any> {
        this.authenticate();

        return this.ocktokit
            .repos
            .getCommit(this.addRepoFullNameToParams({sha: commitSha}, repoFullName))
            .catch(this.handleError);
    }

    getTagCommit(repoFullName, tagName): Promise<any> {
        return this.getTagReference(repoFullName, tagName)
            .then(tagReference => {
                return this.getCommit(repoFullName, tagReference.object.sha);
            });
    }

    getBranchCommit(repoFullName, branchName): Promise<any> {
        return this.getBranchReference(repoFullName, branchName)
            .then(branchReference => {
                return this.getCommit(repoFullName, branchReference.data.object.sha);
            });
    }

    getFileContent(repoFullName, reference, filePath): Promise<string> {
        return this.getFile(repoFullName, reference, filePath)
            .then(file => {
                return new Buffer(file.content, 'base64').toString('ascii');
            });
    }

    private addRepoFullNameToParams(params, repoFullName): object {
        const repoFullNameSplit = repoFullName.split('/');

        params.owner = repoFullNameSplit[0];
        params.repo = repoFullNameSplit[1];

        return params;
    }

    private handleError(error): void {
        // TODO Handle error.
        this.logger.error('GitHub communication failed.', {error: _.toString(error)});

        throw new Error('GitHub communication failed.');
    }

    private authenticate(): void {
        this.ocktokit.authenticate({
            type: 'token',
            token: this.config.github.personalAccessToken,
        });
    }

    private getReference(repoFullName, reference): Promise<any> {
        this.authenticate();

        return this.ocktokit
            .gitdata
            .getReference(this.addRepoFullNameToParams({ref: reference}, repoFullName))
            .catch(this.handleError);
    }

    private getTagReference(repoFullName, tagName): Promise<any> {
        return this.getReference(repoFullName, 'tags/' + tagName);
    }

    private getBranchReference(repoFullName, branchName): Promise<any> {
        return this.getReference(repoFullName, 'heads/' + branchName);
    }

    private getFile(repoFullName, reference, filePath): Promise<any> {
        this.authenticate();

        return this.ocktokit
            .repos
            .getContent(this.addRepoFullNameToParams({path: filePath, ref: reference}, repoFullName))
            .catch(this.handleError);
    }

}
