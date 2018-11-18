import {Injectable} from '@nestjs/common';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverCommandLogEntryFilterArgumentsInterface} from './filter-argument/resolver-command-log-entry-filter-arguments.interface';
import {LogRepository} from '../../persistence/repository/log.repository';
import {LogTypeInterface} from '../type/log-type.interface';
import * as mongoose from 'mongoose';

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
                args as ResolverCommandLogEntryFilterArgumentsInterface,
            );
            const logs = await this.logRepository.find(
                criteria,
                resolverListOptions.offset,
                resolverListOptions.limit,
                {_id: 1},
            );
            const data: LogTypeInterface[] = [];
            for (const log of logs) {
                data.push({
                    id: log._id.toString(),
                    message: log.message,
                    timestamp: log.timestamp,
                } as LogTypeInterface);
            }

            return data;
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverCommandLogEntryFilterArgumentsInterface): any {
        if (args.afterId) {
            criteria._id = {$gt: new mongoose.Types.ObjectId(args.afterId)};
        }

        return criteria;
    }
}
