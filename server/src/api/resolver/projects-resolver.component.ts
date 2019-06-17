import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectTypeInterface} from '../type/project-type.interface';
import {CreateProjectInputTypeInterface} from '../input-type/create-project-input-type.interface';
import {ResolverPaginationArgumentsHelper} from '../pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from '../pagination-argument/resolver-pagination-arguments.interface';
import {ResolverProjectFilterArgumentsInterface} from '../filter-argument/resolver-project-filter-arguments.interface';
import {Args, Mutation, Parent, Query, ResolveProperty, Resolver} from '@nestjs/graphql';
import {DefinitionTypeInterface} from '../type/definition-type.interface';
import {ResolverDefinitionFilterArgumentsInterface} from '../filter-argument/resolver-definition-filter-arguments.interface';
import {AssetTypeInterface} from '../type/asset-type.interface';
import {ResolverAssetFilterArgumentsInterface} from '../filter-argument/resolver-asset-filter-arguments.interface';
import {ProjectLister} from '../lister/project-lister.component';
import {ProjectModelToTypeMapper} from '../model-to-type-mapper/project-model-to-type-mapper.component';
import {DefinitionModelToTypeMapper} from '../model-to-type-mapper/definition-model-to-type-mapper.component';
import {AssetModelToTypeMapper} from '../model-to-type-mapper/asset-model-to-type-mapper.component';
import {DefinitionLister} from '../lister/definition-lister.component';
import {AssetLister} from '../lister/asset-lister.component';
import * as escapeStringRegexp from 'escape-string-regexp';

@Resolver('Project')
export class ProjectsResolver {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly projectRepository: ProjectRepository,
        private readonly projectLister: ProjectLister,
        private readonly projectModelToTypeMapper: ProjectModelToTypeMapper,
        private readonly definitionLister: DefinitionLister,
        private readonly assetLister: AssetLister,
        private readonly definitionModelToTypeMapper: DefinitionModelToTypeMapper,
        private readonly assetModelToTypeMapper: AssetModelToTypeMapper,
    ) { }

    @Query('projects')
    async getAll(
        @Args() args?: any,
    ): Promise<ProjectTypeInterface[]> {
        const criteria = this.applyProjectFilterArgumentToCriteria({}, args as ResolverProjectFilterArgumentsInterface);
        const projects = await this.projectLister.getList(criteria, args as ResolverPaginationArgumentsInterface);

        return this.projectModelToTypeMapper.mapMany(projects);
    }

    @Query('project')
    async getOne(
        @Args('id') id: string,
    ): Promise<ProjectTypeInterface> {
        const project = await this.projectRepository.findById(id);

        return this.projectModelToTypeMapper.mapOne(project);
    }

    @ResolveProperty('definitions')
    async getDefinitions(
        @Parent() project: ProjectTypeInterface,
        @Args() args: any,
    ): Promise<DefinitionTypeInterface[]> {
        const criteria = this.applyDefinitionFilterArgumentToCriteria(
            {projectId: project.id},
            args as ResolverDefinitionFilterArgumentsInterface,
        );
        const definitions = await this.definitionLister.getList(criteria, args as ResolverPaginationArgumentsInterface);

        return this.definitionModelToTypeMapper.mapMany(definitions);
    }

    @ResolveProperty('assets')
    async getAssets(
        @Parent() project: ProjectTypeInterface,
        @Args() args: any,
    ): Promise<AssetTypeInterface[]> {
        const resolverListOptions = args as ResolverPaginationArgumentsInterface;
        const criteria = this.applyAssetFilterArgumentToCriteria(
            {projectId: project.id, uploaded: true},
            args as ResolverAssetFilterArgumentsInterface,
        );
        const assets = await this.assetLister.getList(criteria, args as ResolverPaginationArgumentsInterface);

        return this.assetModelToTypeMapper.mapMany(assets);
    }

    @Mutation('createProject')
    async create(
        @Args() createProjectInput: CreateProjectInputTypeInterface,
    ): Promise<ProjectTypeInterface> {
        // TODO Add input validation.
        const project = await this.projectRepository.create(createProjectInput);

        return this.projectModelToTypeMapper.mapOne(project);
    }

    // TODO Move somewhere else.
    protected applyProjectFilterArgumentToCriteria(
        criteria: any,
        args: ResolverProjectFilterArgumentsInterface,
    ): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }

        return criteria;
    }

    // TODO Move somewhere else.
    protected applyDefinitionFilterArgumentToCriteria(
        criteria: any,
        args: ResolverDefinitionFilterArgumentsInterface,
    ): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }

    // TODO Move somewhere else.
    protected applyAssetFilterArgumentToCriteria(
        criteria: any,
        args: ResolverAssetFilterArgumentsInterface,
    ): object {
        if (args.id) {
            criteria.id = new RegExp(escapeStringRegexp(args.id));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }
}
