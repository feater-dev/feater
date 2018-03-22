import * as _ from 'lodash';
import { Controller, Get, Post, Response, Param, HttpStatus, Body } from '@nestjs/common';
import { Validator } from '../validation/validator.component';
import { BuildDefinitionRepository } from '../../persistence/build-definition.repository';
import { ProjectRepository } from '../../persistence/project.repository';
import { CreateBuildDefinitionRequestDto } from '../dto/request/create-build-definition-request.dto';
import { CreateBuildDefinitionResponseDto } from '../dto/response/create-build-definition-response.dto';
import { FindOneBuildDefinitionResponseDto } from '../dto/response/find-one-build-definition-response.dto';
import { FindAllBuildDefinitionResponseDto } from '../dto/response/find-all-build-definition-response.dto';

@Controller('/api/build-definition')
export class BuildDefinitionController {

    constructor(
        private readonly validator: Validator,
        private readonly projectRepository: ProjectRepository,
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
    ) {}

    @Get()
    async findAll(
        @Response() res,
    ): Promise<any> {
        const buildDefinitions = await this.buildDefinitionRepository.find({});
        const data: FindAllBuildDefinitionResponseDto[] = [];
        for (const buildDefinition of buildDefinitions) {
            data.push({
                _id: buildDefinition._id,
                name: buildDefinition.name,
            } as FindAllBuildDefinitionResponseDto);
        }
        res.status(HttpStatus.OK).json({ data });
    }

    @Get(':id')
    async findOne(
        @Response() res,
        @Param() params,
    ): Promise<any> {
        const id = params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(HttpStatus.BAD_REQUEST).send();

            return;
        }

        const buildDefinition = await this.buildDefinitionRepository.findById(id);
        if (null === buildDefinition) {
            res.status(HttpStatus.NOT_FOUND).send();

            return;
        }

        const project = await this.projectRepository.findById(buildDefinition.projectId);
        if (null === project) {
            res.status(HttpStatus.CONFLICT).send();

            return;
        }

        res.status(HttpStatus.OK).json({
            data: {
                _id: buildDefinition._id,
                name: buildDefinition.name,
                // TODO This is not properly mapped in schema and hence not directly accessible.
                config: buildDefinition._doc.config,
                project: {
                    _id: project._id,
                    name: project.name,
                },
            } as FindOneBuildDefinitionResponseDto,
        });
    }

    @Post()
    async create(
        @Response() res,
        @Body() createBuildDefinitionDto: CreateBuildDefinitionRequestDto,
    ): Promise<any> {
        this.validator
            .validateCreateBuildDefinitionDto(createBuildDefinitionDto)
            .then(
                async () => {
                    const project = await this.projectRepository.findById(createBuildDefinitionDto.projectId);
                    if (null === project) {
                        res.status(HttpStatus.BAD_REQUEST).send();

                        return;
                    }

                    this.validator
                        .validateBuildDefinitionConfig(createBuildDefinitionDto.config)
                        .then(
                            async () => {
                                const buildDefinition = await this.buildDefinitionRepository.create(createBuildDefinitionDto);

                                res.status(HttpStatus.CREATED).json({
                                    data: {
                                        id: buildDefinition._id,
                                    } as CreateBuildDefinitionResponseDto,
                                });
                            },
                            (error) => {
                                res.status(HttpStatus.BAD_REQUEST).send();
                            },
                        );
                },
                (error) => {
                    res.status(HttpStatus.BAD_REQUEST).send();
                },
            );
    }

}
