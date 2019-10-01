import { Injectable } from '@nestjs/common';
import { ResolverPaginationArgumentsHelper } from '../pagination-argument/resolver-pagination-arguments-helper.component';
import { DefinitionRepository } from '../../persistence/repository/definition.repository';
import { DefinitionInterface } from '../../persistence/interface/definition.interface';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';

@Injectable()
export class DefinitionLister {
    protected readonly defaultSortKey = 'created_at_desc';

    protected readonly sortMap = {
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
        private readonly definitionRepository: DefinitionRepository,
    ) {}

    async getList(
        criteria: any,
        pagination: ResolverPaginationArgumentsInterface,
    ): Promise<DefinitionInterface[]> {
        return await this.definitionRepository.find(
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
