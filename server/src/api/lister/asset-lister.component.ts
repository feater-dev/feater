import { Injectable } from '@nestjs/common';
import { ResolverPaginationArgumentsHelper } from '../pagination-argument/resolver-pagination-arguments-helper.component';
import { AssetRepository } from '../../persistence/repository/asset.repository';
import { AssetInterface } from '../../persistence/interface/asset.interface';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';

@Injectable()
export class AssetLister {
    private readonly defaultSortKey = 'id_asc';

    private readonly sortMap = {
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

    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly assetRepository: AssetRepository,
    ) {}

    async getList(
        criteria: unknown,
        pagination: ResolverPaginationArgumentsInterface,
    ): Promise<AssetInterface[]> {
        return await this.assetRepository.find(
            criteria,
            this.resolveListOptionsHelper.getOffset(pagination.offset),
            this.resolveListOptionsHelper.getLimit(pagination.limit),
            this.resolveListOptionsHelper.getSort(
                this.defaultSortKey,
                this.sortMap,
                pagination.sortKey,
            ),
        );
    }
}
