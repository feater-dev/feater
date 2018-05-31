import {ConfigInputTypeInterface} from './nested/build-definition-config/config-input-type.interface';

export interface CreateBuildDefinitionInputTypeInterface {
    readonly projectId: string;
    readonly name: string;
    readonly config: ConfigInputTypeInterface,
}
