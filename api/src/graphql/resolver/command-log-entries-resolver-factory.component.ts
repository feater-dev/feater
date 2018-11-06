import {Injectable} from '@nestjs/common';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverLogFilterArgumentsInterface} from './filter-argument/resolver-log-filter-arguments.interface';
import {LogRepository} from '../../persistence/repository/log.repository';
import {LogTypeInterface} from '../type/log-type.interface';

@Injectable()
export class CommandLogEntriesResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly logRepository: LogRepository,
    ) { }

    public getListResolver(queryExtractor?: (object: any) => any): (object: any, args: any) => Promise<LogTypeInterface[]> {
        return async (object: any, args: any): Promise<LogTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverLogFilterArgumentsInterface,
            );
            const logs = await this.logRepository.find(
                criteria,
                0,
                9999,
                {_id: 1},
            );
            const data: LogTypeInterface[] = [];
            for (const log of logs) {
                data.push({
                    message: log.message,
                } as LogTypeInterface);
            }

            return data;
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverLogFilterArgumentsInterface): any {
        return criteria;
    }
}
