import { DeployKeyHelperComponent } from '../../helper/deploy-key-helper.component';
import { Injectable } from '@nestjs/common';
import { DeployKeyInterface } from '../../persistence/interface/deploy-key.interface';

@Injectable()
export class GitSshCommandEnvVariablesFactory {
    constructor(private readonly deployKeyHelper: DeployKeyHelperComponent) {}

    async create(deployKey: DeployKeyInterface): Promise<NodeJS.ProcessEnv> {
        const identityFileAbsoluteGuestPath = this.deployKeyHelper.getIdentityFileAbsoluteGuestPath(
            deployKey.cloneUrl,
        );

        return {
            GIT_SSH_COMMAND: [
                `sshpass`,
                `-e`,
                `-P`,
                `"Enter passphrase for key '${identityFileAbsoluteGuestPath}': "`,
                `ssh`,
                `-o`,
                `StrictHostKeyChecking=no`,
                `-i`,
                identityFileAbsoluteGuestPath,
            ].join(' '),
            SSHPASS: deployKey.passphrase,
        };
    }
}
