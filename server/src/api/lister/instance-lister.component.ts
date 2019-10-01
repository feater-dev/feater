import { Injectable } from '@nestjs/common';
import { ResolverPaginationArgumentsHelper } from '../pagination-argument/resolver-pagination-arguments-helper.component';
import { InstanceRepository } from '../../persistence/repository/instance.repository';
import { InstanceInterface } from '../../persistence/interface/instance.interface';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';

@Injectable()
export class InstanceLister {
    protected readonly defaultSortKey = 'created_at_desc';

    readonly sortMap = {
        name_asc: {
            name: 'asc',
            createdAt: 'desc',
            _id: 'desc',
        },
        name_desc: {
            name: 'desc',
            createdAt: 'desc',
            _id: 'desc',
        },
        created_at_asc: {
            createdAt: 'asc',
            _id: 'desc',
        },
        created_at_desc: {
            createdAt: 'desc',
            _id: 'desc',
        },
    };

    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly instanceRepository: InstanceRepository,
    ) {}

    async getList(
        criteria: any,
        pagination: ResolverPaginationArgumentsInterface,
    ): Promise<InstanceInterface[]> {
        return await this.instanceRepository.find(
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
