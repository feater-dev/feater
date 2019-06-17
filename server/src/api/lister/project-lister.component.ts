import {Injectable} from '@nestjs/common';
import {ResolverPaginationArgumentsHelper} from '../pagination-argument/resolver-pagination-arguments-helper.component';
import {ProjectRepository} from '../../persistence/repository/project.repository';
import {ProjectInterface} from '../../persistence/interface/project.interface';
import {ResolverPaginationArgumentsInterface} from '../pagination-argument/resolver-pagination-arguments.interface';

@Injectable()
export class ProjectLister {
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
        private readonly projectRepository: ProjectRepository,
    ) { }

    async getList(
        criteria: any,
        pagination: ResolverPaginationArgumentsInterface,
    ): Promise<ProjectInterface[]> {
        return await this.projectRepository.find(
            criteria,
            this.resolveListOptionsHelper.getOffset(pagination.offset),
            this.resolveListOptionsHelper.getLimit(pagination.limit),
            this.resolveListOptionsHelper.getSort(this.defaultSortKey, this.sortMap, pagination.sortKey),
        );
    }
}
