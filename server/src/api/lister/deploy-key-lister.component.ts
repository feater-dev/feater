import {Injectable} from '@nestjs/common';
import {DeployKeyRepository} from '../../persistence/repository/deploy-key.repository';
import {ResolverPaginationArgumentsInterface} from '../pagination-argument/resolver-pagination-arguments.interface';
import {ResolverPaginationArgumentsHelper} from '../pagination-argument/resolver-pagination-arguments-helper.component';
import {DeployKeyInterface} from '../../persistence/interface/deploy-key.interface';
import {DefinitionRepository} from '../../persistence/repository/definition.repository';
import {DeployKeyHelperComponent} from '../../helper/deploy-key-helper.component';

@Injectable()
export class DeployKeyLister {
    protected readonly defaultSortKey = 'created_at_asc';

    protected readonly sortMap = {
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
        private readonly deployKeyRepository: DeployKeyRepository,
        private readonly definitionRepository: DefinitionRepository,
        private readonly deployKeyHelper: DeployKeyHelperComponent,
    ) { }

    async getList(
        criteria: any,
        pagination: ResolverPaginationArgumentsInterface,
    ): Promise<DeployKeyInterface[]> {
        return await this.deployKeyRepository.find(
            criteria,
            this.resolveListOptionsHelper.getOffset(pagination.offset),
            this.resolveListOptionsHelper.getLimit(pagination.limit),
            this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, pagination.sortKey),
        );
    }
}
