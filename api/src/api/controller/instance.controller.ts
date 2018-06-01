import * as _ from 'lodash';
import * as nanoidGenerate from 'nanoid/generate';
import {Controller, Get, Post, Response, Param, HttpStatus, Body} from '@nestjs/common';
import {InstanceRepository} from '../../persistence/repository/instance.repository';
import {CreateInstanceRequestDto} from '../dto/request/create-instance-request.dto';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {Validator} from '../validation/validator.component';
import {Instantiator} from '../../instantiation/instantiator.component';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {FindAllInstanceResponseDto} from '../dto/response/find-all-instance-response.dto';
import {FindOneInstanceResponseDto} from '../dto/response/find-one-instance-response.dto';
import {CreateInstanceResponseDto} from '../dto/response/create-instance-response.dto';

@Controller('/api/instance')
export class InstanceController {

    constructor(
        private readonly validator: Validator,
        private readonly projectRepository: ProjectRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instanceRepository: InstanceRepository,
        private readonly instantiator: Instantiator,
    ) {}

    @Get()
    async findAll(
        @Response() res,
    ): Promise<any> {
        const instances = await this.instanceRepository.find({});
        const data: FindAllInstanceResponseDto[] = [];

        for (const instance of instances) {
            data.push({
                _id: instance._id,
                name: instance.name,
            } as FindAllInstanceResponseDto);
        }

        res.status(HttpStatus.OK).json(data);
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
        const persistentInstance = await this.instanceRepository.findById(id);
        if (null === persistentInstance) {
            res.status(HttpStatus.NOT_FOUND).send();

            return;
        }

        const persistentBuildDefiniton = await this.definitionRepository.findById(persistentInstance.definitionId);
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
        for (const summaryItem of persistentInstance.summaryItems) {
            mappedSummaryItems.push({
                name: summaryItem.name,
                value: summaryItem.value,
            });
        }

        const mappedEnvironmentalVariables = [];
        for (const environmentalVariable of persistentInstance.environmentalVariables) {
            mappedEnvironmentalVariables.push({
                key: environmentalVariable.key,
                value: environmentalVariable.value,
            });
        }

        res.status(HttpStatus.OK).json({
            _id: persistentInstance._id,
            name: persistentInstance.name,
            hash: persistentInstance.hash,
            definition: {
                _id: persistentBuildDefiniton._id,
                name: persistentBuildDefiniton.name,
                config: persistentBuildDefiniton.config,
                project: {
                    _id: persistentProject._id,
                    name: persistentProject.name,
                },
            },
            services: persistentInstance.services,
            summaryItems: mappedSummaryItems,
            environmentalVariables: mappedEnvironmentalVariables,
        } as FindOneInstanceResponseDto);
    }

    @Post()
    async create(
        @Response() res,
        @Body() createInstanceDto: CreateInstanceRequestDto,
    ): Promise<any> {

        const scope = {
            definition: null,
            instance: null,
        };

        createInstanceDto.hash = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8);

        const validateRequest = () => {
            return this.validator.validateCreateInstanceDto(createInstanceDto);
        };

        const findDefinition = async () => {
            const definition = await this.definitionRepository.findById(createInstanceDto.definitionId);
            if (null === definition) {
                res.status(HttpStatus.BAD_REQUEST).send();

                return;
            }
            scope.definition = definition;
        };

        const persistDocument = async () => {
            const instance = await this.instanceRepository.create(createInstanceDto);
            scope.instance = instance;
        };

        const respondWithId = () => {
            res.status(HttpStatus.CREATED).json({
                id: scope.instance._id,
            } as CreateInstanceResponseDto);
        };

        const executeInstanceJobs = () => {
            process.nextTick(() => {
                const build = this.instantiator.createBuild(
                    scope.instance._id,
                    scope.instance.hash,
                    scope.definition,
                );
                this.instantiator.instantiateBuild(build);
            });
        };

        const respondWithErrors = (errors) => {
            res.status(HttpStatus.BAD_REQUEST).send();
        };

        return validateRequest()
            .then(findDefinition)
            .then(persistDocument)
            .then(respondWithId)
            .then(executeInstanceJobs)
            .catch(respondWithErrors);

    }

}
