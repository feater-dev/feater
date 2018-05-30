import {ConfigTypeInterface} from './nested/build-definition-config/config-type.interface';

export interface BuildDefinitionTypeInterface {
    readonly id: string;
    readonly name: string;
    readonly projectId: string;
    readonly config: ConfigTypeInterface;
}
