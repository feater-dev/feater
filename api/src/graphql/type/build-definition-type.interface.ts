import {BuildDefinitionConfigTypeInterface} from './build-definition-config-type.interface';

export interface BuildDefinitionTypeInterface {
    readonly id: string;
    readonly name: string;
    readonly projectId: string;
    readonly config: BuildDefinitionConfigTypeInterface;
}
