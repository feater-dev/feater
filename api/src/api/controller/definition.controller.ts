import {Controller, Get, Post, Response, Param, HttpStatus, Body} from '@nestjs/common';
import {Validator} from '../validation/validator.component';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {CreateDefinitionRequestDto} from '../dto/request/create-definition-request.dto';
import {CreateDefinitionResponseDto} from '../dto/response/create-definition-response.dto';
import {FindOneDefinitionResponseDto} from '../dto/response/find-one-definition-response.dto';
import {FindAllDefinitionResponseDto} from '../dto/response/find-all-definition-response.dto';

@Controller('/api/definition')
export class DefinitionController {

    constructor(
        private readonly validator: Validator,
        private readonly projectRepository: ProjectRepository,
        private readonly definitionRepository: DefinitionRepository,
    ) {}

    @Get()
    async findAll(
        @Response() res,
    ): Promise<any> {
        const definitions = await this.definitionRepository.find({});
        const data: FindAllDefinitionResponseDto[] = [];

        for (const definition of definitions) {
            data.push({
                _id: definition._id,
                name: definition.name,
            } as FindAllDefinitionResponseDto);
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

        const definition = await this.definitionRepository.findById(id);
        if (null === definition) {
            res.status(HttpStatus.NOT_FOUND).send();

            return;
        }

        const project = await this.projectRepository.findById(definition.projectId);
        if (null === project) {
            res.status(HttpStatus.CONFLICT).send();

            return;
        }

        res.status(HttpStatus.OK).json({
            _id: definition._id,
            name: definition.name,
            // TODO This is not properly mapped in schema and hence not directly accessible.
            config: definition._doc.config,
            project: {
                _id: project._id,
                name: project.name,
            },
        } as FindOneDefinitionResponseDto);
    }

    @Post()
    async create(
        @Response() res,
        @Body() createDefinitionDto: CreateDefinitionRequestDto,
    ): Promise<any> {
        // TODO Restore input validation.
        const project = await this.projectRepository.findById(createDefinitionDto.projectId);
        if (null === project) {
            res.status(HttpStatus.BAD_REQUEST).send();

            return;
        }
        const definition = await this.definitionRepository.create(createDefinitionDto);

        res.status(HttpStatus.CREATED).json({
            id: definition._id,
        } as CreateDefinitionResponseDto);
    }

}
