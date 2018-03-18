import { Component } from '@nestjs/common';
import { Validator as JsonSchemaValidator} from 'jsonschema';
import { CreateBuildDefinitionRequestDto } from '../dto/request/create-build-definition-request.dto';
import { CreateProjectRequestDto } from '../dto/request/create-project-request.dto';
import { CreateBuildInstanceRequestDto } from '../dto/request/create-build-instance-request.dto';
import { createProjectDtoJsonSchema } from './schema/api/create-project-dto.json-schema';
import { createBuildDefinitionDtoJsonSchema } from './schema/api/create-build-definition-dto.json-schema';
import { createBuildInstanceDtoJsonSchema } from './schema/api/create-build-instance-dto.json-schema';
import { buildDefinitionConfigJsonSchema } from './schema/build-definition-config.json-schema';

@Component()
export class Validator {

    private readonly jsonSchemaValidator: JsonSchemaValidator;

    constructor() {
        this.jsonSchemaValidator = new JsonSchemaValidator();
    }

    async validateCreateProjectDto(createProjectDto: CreateProjectRequestDto): Promise<any> {
        return await this.validate(createProjectDto, createProjectDtoJsonSchema);
    }

    async validateCreateBuildDefinitionDto(createBuildDefinitionDto: CreateBuildDefinitionRequestDto): Promise<any> {
        return await this.validate(createBuildDefinitionDto, createBuildDefinitionDtoJsonSchema);
    }

    async validateCreateBuildInstanceDto(createBuildInstanceDto: CreateBuildInstanceRequestDto): Promise<any> {
        return await this.validate(createBuildInstanceDto, createBuildInstanceDtoJsonSchema);
    }

    async validateBuildDefinitionConfig(buildDefinitionConfig: any): Promise<any> {
        return await this.validate(buildDefinitionConfig, buildDefinitionConfigJsonSchema);
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