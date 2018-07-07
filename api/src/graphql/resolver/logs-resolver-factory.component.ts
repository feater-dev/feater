import {Component} from '@nestjs/common';
import {LogRepository} from '../../persistence/repository/log.repository';
import {LogTypeInterface} from '../type/log-type.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverLogFilterArgumentsInterface} from './filter-argument/resolver-log-filter-arguments.interface';

@Component()
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
                args as ResolverLogFilterArgumentsInterface,
            );
            const logs = await this.logRepository.findByInstanceId(criteria.instanceId);
            const data: LogTypeInterface[] = [];
            for (const log of logs) {
                data.push(log as LogTypeInterface);
            }

            return data;
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverLogFilterArgumentsInterface): any {
        return criteria;
    }
}
