import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveProperty,
    Resolver,
} from '@nestjs/graphql';
import { AssetTypeInterface } from '../type/asset-type.interface';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';
import { ResolverAssetFilterArgumentsInterface } from '../filter-argument/resolver-asset-filter-arguments.interface';
import { ProjectRepository } from '../../persistence/repository/project.repository';
import { ProjectModelToTypeMapper } from '../model-to-type-mapper/project-model-to-type-mapper.component';
import { AssetLister } from '../lister/asset-lister.component';
import { AssetModelToTypeMapper } from '../model-to-type-mapper/asset-model-to-type-mapper.component';
import { AssetRepository } from '../../persistence/repository/asset.repository';
import { CreateAssetInputTypeInterface } from '../input-type/create-asset-input-type.interface';
import { ProjectTypeInterface } from '../type/project-type.interface';
import { RemoveAssetInputTypeInterface } from '../input-type/remove-asset-input-type.interface';
import * as escapeStringRegexp from 'escape-string-regexp';

@Resolver('Asset')
export class AssetResolver {
    constructor(
        private readonly assetModelToTypeMapper: AssetModelToTypeMapper,
        private readonly assetLister: AssetLister,
        private readonly assetRepository: AssetRepository,
        private readonly projectRepository: ProjectRepository,
        private readonly projectModelToTypeMapper: ProjectModelToTypeMapper,
    ) {}

    @Query('assets')
    async getAll(@Args() args?: unknown): Promise<AssetTypeInterface[]> {
        const criteria = this.applyAssetFilterArgumentToCriteria(
            { uploaded: true },
            args as ResolverAssetFilterArgumentsInterface,
        );
        const assets = await this.assetLister.getList(
            criteria,
            args as ResolverPaginationArgumentsInterface,
        );

        return this.assetModelToTypeMapper.mapMany(assets);
    }

    @Query('asset')
    async getOne(
        @Args('id') id: string,
        @Args('projectId') projectId: string,
    ): Promise<AssetTypeInterface> {
        const criteria = { id, projectId, uploaded: true };
        const asset = await this.assetRepository.findOneOrFail(criteria);

        return this.assetModelToTypeMapper.mapOne(asset);
    }

    @ResolveProperty('project')
    async getProject(
        @Parent() asset: AssetTypeInterface,
    ): Promise<ProjectTypeInterface> {
        const project = await this.projectRepository.findByIdOrFail(
            asset.projectId,
        );

        return this.projectModelToTypeMapper.mapOne(project);
    }

    @Mutation('createAsset')
    async create(
        @Args() createAssetInput: CreateAssetInputTypeInterface,
    ): Promise<AssetTypeInterface> {
        // TODO Add validation.
        const asset = await this.assetRepository.create(createAssetInput);

        return this.assetModelToTypeMapper.mapOne(asset);
    }

    @Mutation('removeAsset')
    async remove(
        @Args() removeAssetInput: RemoveAssetInputTypeInterface,
    ): Promise<boolean> {
        return await this.assetRepository.removeByProjectIdAndIdentifier(
            removeAssetInput.projectId,
            removeAssetInput.id,
        );
    }

    // TODO Move somewhere else.
    // TODO Replace `any` with more specific type.
    private applyAssetFilterArgumentToCriteria(
        criteria: any,
        args: ResolverAssetFilterArgumentsInterface,
    ): unknown {
        if (args.id) {
            criteria.id = new RegExp(escapeStringRegexp(args.id));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }
}
