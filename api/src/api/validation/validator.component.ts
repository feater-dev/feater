import {Component} from '@nestjs/common';
import {Validator as JsonSchemaValidator} from 'jsonschema';

import {createProjectDtoJsonSchema} from './schema/api/create-project-dto.json-schema';
import {createDefinitionDtoJsonSchema} from './schema/api/create-definition-dto.json-schema';
import {createInstanceDtoJsonSchema} from './schema/api/create-instance-dto.json-schema';
import {definitionConfigJsonSchema} from './schema/definition-config.json-schema';

import {CreateDefinitionInputTypeInterface} from '../../graphql/input-type/create-definition-input-type.interface';
import {CreateInstanceInputTypeInterface} from '../../graphql/input-type/create-instance-input-type.interface';
import {CreateProjectInputTypeInterface} from '../../graphql/input-type/create-project-input-type.interface';


@Component()
export class Validator {

    private readonly jsonSchemaValidator: JsonSchemaValidator;

    constructor() {
        this.jsonSchemaValidator = new JsonSchemaValidator();
    }

    async validateCreateProjectInputType(createProjectInputType: CreateProjectInputTypeInterface): Promise<any> {
        return await this.validate(createProjectInputType, createProjectDtoJsonSchema);
    }

    async validateCreateDefinitionInputType(createDefinitionInputType: CreateDefinitionInputTypeInterface): Promise<any> {
        return await this.validate(createDefinitionInputType, createDefinitionDtoJsonSchema);
    }

    async validateCreateInstanceInputType(createInstanceInputType: CreateInstanceInputTypeInterface): Promise<any> {
        return await this.validate(createInstanceInputType, createInstanceDtoJsonSchema);
    }

    async validateDefinitionConfig(definitionConfig: any): Promise<any> {
        return await this.validate(definitionConfig, definitionConfigJsonSchema);
    }

    private validate(data: any, schema: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const result = this.jsonSchemaValidator.validate(data, schema);
            if (result.errors.length) {
                reject(result.errors);

                return;
            }

            resolve();
        });
    }

}