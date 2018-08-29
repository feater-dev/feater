import {Component} from '@nestjs/common';
import {AssetTypeInterface} from '../type/asset-type.interface';
import {AssetRepository} from '../../persistence/repository/asset.repository';
import {AssetInterface} from '../../persistence/interface/asset.interface';
import {CreateAssetInputTypeInterface} from '../input-type/create-asset-input-type.interface';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverAssetFilterArgumentsInterface} from './filter-argument/resolver-asset-filter-arguments.interface';
import * as escapeStringRegexp from 'escape-string-regexp';

@Component()
export class AssetResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly assetRepository: AssetRepository,
    ) { }

    protected readonly defaultSortKey = 'id_asc';

    protected readonly sortMap = {
        id_asc: {
            id: 'asc',
            createdAt: 'desc',
            _id: 'desc',
        },
        id_desc: {
            id: 'desc',
            createdAt: 'asc',
            _id: 'asc',
        },
        created_at_asc: {
            createdAt: 'asc',
            id: 'asc',
            _id: 'desc',
        },
        created_at_desc: {
            createdAt: 'desc',
            id: 'desc',
            _id: 'asc',
        },
    };

    public getListResolver(queryExtractor?: (object: object) => object): (object: object, args: object) => Promise<AssetTypeInterface[]> {
        return async (object: object, args: object): Promise<AssetTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverAssetFilterArgumentsInterface,
            );
            const assets = await this.assetRepository.find(
                criteria,
                this.resolveListOptionsHelper.getOffset(resolverListOptions.offset),
                this.resolveListOptionsHelper.getLimit(resolverListOptions.limit),
                this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, resolverListOptions.sortKey),
            );
            const data: AssetTypeInterface[] = [];
            for (const asset of assets) {
                data.push(this.mapPersistentModelToTypeModel(asset));
            }

            return data;
        };
    }

    public getItemResolver(idExtractor: (obj: any, args: any) => string): (obj: any, args: any) => Promise<AssetTypeInterface> {
        return async (obj: any, args: any): Promise<AssetTypeInterface> => {
            return this.mapPersistentModelToTypeModel(
                await this.assetRepository.findById(idExtractor(obj, args)),
            );
        };
    }

    public getCreateItemResolver(): (_: any, createAssetInput: CreateAssetInputTypeInterface) => Promise<AssetTypeInterface> {
        return async (_: any, createAssetInput: CreateAssetInputTypeInterface): Promise<AssetTypeInterface> => {
            // TODO Add validation.
            const asset = await this.assetRepository.create(createAssetInput);

            return this.mapPersistentModelToTypeModel(asset);
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverAssetFilterArgumentsInterface): object {
        if (args.id) {
            criteria.id = new RegExp(escapeStringRegexp(args.id));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }

        return criteria;
    }

    protected mapPersistentModelToTypeModel(asset: AssetInterface): AssetTypeInterface {
        return {
            id: asset.id,
            projectId: asset.projectId,
            filename: asset.filename,
            description: asset.description,
            createdAt: asset.createdAt,
        } as AssetTypeInterface;
    }
}
