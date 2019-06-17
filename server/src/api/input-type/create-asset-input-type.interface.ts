import {ConfigInputTypeInterface} from './nested/definition-config/config-input-type.interface';

export interface CreateAssetInputTypeInterface {
    readonly projectId: string;
    readonly name: string;
    readonly config: ConfigInputTypeInterface,
}
