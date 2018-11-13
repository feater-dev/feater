import {Injectable} from '@nestjs/common';
import {LogRepository} from '../../persistence/repository/log.repository';
import {LogTypeInterface} from '../type/log-type.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverCommandLogEntryFilterArgumentsInterface} from './filter-argument/resolver-command-log-entry-filter-arguments.interface';

@Injectable()
export class LogsResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly logRepository: LogRepository,
    ) { }

    public getListResolver(queryExtractor?: (object: any) => any): (object: any, args: any) => Promise<LogTypeInterface[]> {
        return async (object: any, args: any): Promise<LogTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverCommandLogEntryFilterArgumentsInterface,
            );
            const logs = await this.logRepository.findByInstanceId(criteria.instanceId);
            const data: LogTypeInterface[] = [];
            for (const log of logs) {
                data.push({
                    message: log.message,
                    createdAt: log.timestamp,
                } as LogTypeInterface);
            }

            return data;
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverCommandLogEntryFilterArgumentsInterface): any {
        return criteria;
    }
}
