import * as _ from 'lodash';
import * as nanoidGenerate from 'nanoid/generate';
import { Controller, Get, Post, Response, Param, HttpStatus, Body } from '@nestjs/common';
import { BuildInstanceRepository } from '../../persistence/repository/build-instance.repository';
import { CreateBuildInstanceRequestDto } from '../dto/request/create-build-instance-request.dto';
import { BuildDefinitionRepository } from '../../persistence/repository/build-definition.repository';
import { Validator } from '../validation/validator.component';
import { Instantiator } from '../../instantiation/instantiator.component';
import { ProjectRepository } from '../../persistence/repository/project.repository';
import { FindAllBuildInstanceResponseDto } from '../dto/response/find-all-build-instance-response.dto';
import { FindOneBuildInstanceResponseDto } from '../dto/response/find-one-build-instance-response.dto';
import { CreateBuildInstanceResponseDto } from '../dto/response/create-build-instance-response.dto';

@Controller('/api/build-instance')
export class BuildInstanceController {

    constructor(
        private readonly validator: Validator,
        private readonly projectRepository: ProjectRepository,
        private readonly buildDefinitionRepository: BuildDefinitionRepository,
        private readonly buildInstanceRepository: BuildInstanceRepository,
        private readonly instantiator: Instantiator,
    ) {}

    @Get()
    async findAll(
        @Response() res,
    ): Promise<any> {
        const buildInstances = await this.buildInstanceRepository.find({});
        const data: FindAllBuildInstanceResponseDto[] = [];
        for (const buildInstance of buildInstances) {
            data.push({
                _id: buildInstance._id,
                name: buildInstance.name,
            } as FindAllBuildInstanceResponseDto);
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
        const persistentBuildInstance = await this.buildInstanceRepository.findById(id);
        if (null === persistentBuildInstance) {
            res.status(HttpStatus.NOT_FOUND).send();

            return;
        }

        const persistentBuildDefiniton = await this.buildDefinitionRepository.findById(persistentBuildInstance.buildDefinitionId);
        if (null === persistentBuildDefiniton) {
            res.status(HttpStatus.CONFLICT).send();

            return;
        }

        const persistentProject = await this.projectRepository.findById(persistentBuildDefiniton.projectId);
        if (null === persistentProject) {
            res.status(HttpStatus.CONFLICT).send();

            return;
        }

        const mappedSummaryItems = [];
        for (const summaryItem of persistentBuildInstance.summaryItems) {
            mappedSummaryItems.push({
                name: summaryItem.name,
                value: summaryItem.value,
            });
        }

        const mappedEnvironmentalVariables = [];
        for (const environmentalVariable of persistentBuildInstance.environmentalVariables) {
            mappedEnvironmentalVariables.push({
                key: environmentalVariable.key,
                value: environmentalVariable.value,
            });
        }

        res.status(HttpStatus.OK).json({
            data: {
                _id: persistentBuildInstance._id,
                name: persistentBuildInstance.name,
                hash: persistentBuildInstance.hash,
                buildDefinition: {
                    _id: persistentBuildDefiniton._id,
                    name: persistentBuildDefiniton.name,
                    config: persistentBuildDefiniton.config,
                    project: {
                        _id: persistentProject._id,
                        name: persistentProject.name,
                    },
                },
                services: persistentBuildInstance.services,
                summaryItems: mappedSummaryItems,
                environmentalVariables: mappedEnvironmentalVariables,
            } as FindOneBuildInstanceResponseDto,
        });
    }

    @Post()
    async create(
        @Response() res,
        @Body() createBuildInstanceDto: CreateBuildInstanceRequestDto,
    ): Promise<any> {

        const scope = {
            buildDefinition: null,
            buildInstance: null,
        };

        createBuildInstanceDto.hash = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8);

        const validateRequest = () => {
            return this.validator.validateCreateBuildInstanceDto(createBuildInstanceDto);
        };

        const findBuildDefinition = async () => {
            const buildDefinition = await this.buildDefinitionRepository.findById(createBuildInstanceDto.buildDefinitionId);
            if (null === buildDefinition) {
                res.status(HttpStatus.BAD_REQUEST).send();

                return;
            }
            scope.buildDefinition = buildDefinition;
        };

        const persistDocument = async () => {
            const buildInstance = await this.buildInstanceRepository.create(createBuildInstanceDto);
            scope.buildInstance = buildInstance;
        };

        const respondWithId = () => {
            res.status(HttpStatus.CREATED).json({
                data: {
                    id: scope.buildInstance._id,
                } as CreateBuildInstanceResponseDto,
            });
        };

        const executeBuildInstanceJobs = () => {
            process.nextTick(() => {
                const build = this.instantiator.createBuild(
                    scope.buildInstance._id,
                    scope.buildInstance.hash,
                    scope.buildDefinition,
                );
                this.instantiator.instantiateBuild(build);
            });
        };

        const respondWithErrors = (errors) => {
            res.status(HttpStatus.BAD_REQUEST).send();
        };

        return validateRequest()
            .then(findBuildDefinition)
            .then(persistDocument)
            .then(respondWithId)
            .then(executeBuildInstanceJobs)
            .catch(respondWithErrors);

    }

}
