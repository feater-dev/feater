import {Component} from '@nestjs/common';
import { Validator as JsonSchemaValidator} from 'jsonschema';
import {CreateDefinitionRequestDto} from '../dto/request/create-definition-request.dto';
import {CreateProjectRequestDto} from '../dto/request/create-project-request.dto';
import {CreateInstanceRequestDto} from '../dto/request/create-instance-request.dto';
import {createProjectDtoJsonSchema} from './schema/api/create-project-dto.json-schema';
import {createDefinitionDtoJsonSchema} from './schema/api/create-definition-dto.json-schema';
import {createInstanceDtoJsonSchema} from './schema/api/create-instance-dto.json-schema';
import {definitionConfigJsonSchema} from './schema/definition-config.json-schema';

@Component()
export class Validator {

    private readonly jsonSchemaValidator: JsonSchemaValidator;

    constructor() {
        this.jsonSchemaValidator = new JsonSchemaValidator();
    }

    async validateCreateProjectDto(createProjectDto: CreateProjectRequestDto): Promise<any> {
        return await this.validate(createProjectDto, createProjectDtoJsonSchema);
    }

    async validateCreateDefinitionDto(createDefinitionDto: CreateDefinitionRequestDto): Promise<any> {
        return await this.validate(createDefinitionDto, createDefinitionDtoJsonSchema);
    }

    async validateCreateInstanceDto(createInstanceDto: CreateInstanceRequestDto): Promise<any> {
        return await this.validate(createInstanceDto, createInstanceDtoJsonSchema);
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