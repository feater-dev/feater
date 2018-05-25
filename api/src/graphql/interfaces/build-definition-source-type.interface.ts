import {BuildDefinitionSourceReferenceTypeInterface} from './build-definition-source-reference-type.interface';

export interface BuildDefinitionSourceTypeInterface {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly reference: BuildDefinitionSourceReferenceTypeInterface;
}
