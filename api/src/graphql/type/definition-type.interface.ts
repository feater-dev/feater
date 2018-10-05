import {ConfigTypeInterface} from './nested/definition-config/config-type.interface';

export interface DefinitionTypeInterface {
    readonly id: string;
    readonly name: string;
    readonly projectId: string;
    readonly config: ConfigTypeInterface;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
