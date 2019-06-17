import * as sshFingerprint from 'ssh-fingerprint';
import {Injectable} from '@nestjs/common';
import {DeployKeyTypeInterface} from '../type/deploy-key-type.interface';
import {DeployKeyInterface} from '../../persistence/interface/deploy-key.interface';
import {DateConverter} from '../date-converter.component';
import {ProjectInterface} from '../../persistence/interface/project.interface';
import {ProjectTypeInterface} from '../type/project-type.interface';

@Injectable()
export class DeployKeyModelToTypeMapper {
    constructor(
        private readonly dateConverter: DateConverter,
    ) { }

    mapOne(deployKey: DeployKeyInterface): DeployKeyTypeInterface {
        return {
            id: deployKey._id.toString(),
            cloneUrl: deployKey.cloneUrl,
            publicKey: deployKey.publicKey,
            fingerprint: sshFingerprint(deployKey.publicKey),
            createdAt: this.dateConverter.convertDate(deployKey.createdAt),
            updatedAt: this.dateConverter.convertDate(deployKey.updatedAt),
        } as DeployKeyTypeInterface;
    }

    mapMany(deployKeys: DeployKeyInterface[]): DeployKeyTypeInterface[] {
        return deployKeys.map(
            (deployKey: DeployKeyInterface): DeployKeyTypeInterface => {
                return this.mapOne(deployKey);
            },
        );
    }
}
