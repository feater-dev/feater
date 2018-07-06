import {Component} from '@nestjs/common';
import {Config} from '../../config/config.component';
import * as fs from 'fs';

@Component()
export class PublicSshKeyResolverFactory {
    constructor(
        private readonly config: Config,
    ) { }

    public getResolver(): (object: object, args: object) => string {
        return (object: object, args: object): string => {
            return fs.readFileSync(this.config.sshKey.publicKeyPath).toString();
        };
    }
}
