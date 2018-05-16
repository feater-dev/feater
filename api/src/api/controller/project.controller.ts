import { Controller, Get, Post, Response, Param, HttpStatus, Body, Request } from '@nestjs/common';
import { Validator } from '../validation/validator.component';
import { ProjectRepository } from '../../persistence/repository/project.repository';
import { CreateProjectRequestDto } from '../dto/request/create-project-request.dto';
import { CreateProjectResponseDto } from '../dto/response/create-project-response.dto';
import { FindAllProjectResponseDto } from '../dto/response/find-all-project-response.dto';
import { FindOneProjectResponseDto } from '../dto/response/find-one-project-response.dto';

@Controller('/api/project')
export class ProjectController {

    constructor(
        private readonly validator: Validator,
        private readonly projectRepository: ProjectRepository,
    ) {}

    @Get()
    async findAll(
        @Request() req,
        @Response() res,
    ): Promise<any> {
        const projects = await this.projectRepository.find({});
        const data: FindAllProjectResponseDto[] = [];

        for (const project of projects) {
            data.push({
                _id: project._id,
                name: project.name,
            } as FindAllProjectResponseDto);
        }

        res.status(HttpStatus.OK).json(data);
    }

    @Get(':id')
    async findOne(
        @Response() res,
        @Param() params,
    ): Promise<any> {
        const id: string = params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(HttpStatus.BAD_REQUEST).send();

            return;
        }
        const project = await this.projectRepository.findById(params.id);
        if (null === project) {
            res.status(HttpStatus.NOT_FOUND).send();

            return;
        }
        res.status(HttpStatus.OK).json({
            _id: project._id,
            name: project.name,
        } as FindOneProjectResponseDto);
    }

    @Post()
    async create(
        @Response() res,
        @Body() createProjectDto: CreateProjectRequestDto,
    ): Promise<any> {
        this.validator
            .validateCreateProjectDto(createProjectDto)
            .then(
                async () => {
                    const project = await this.projectRepository.create(createProjectDto);
                    res.status(HttpStatus.CREATED).json({
                        id: project._id,
                    } as CreateProjectResponseDto);
                },
                (error) => {
                    res.status(HttpStatus.BAD_REQUEST).send();
                },
            );
    }

}
