import {Injectable} from '@nestjs/common';
import {CommandLogTypeInterface} from '../type/command-log-type.interface';
import {ResolverPaginationArgumentsHelper} from './pagination-argument/resolver-pagination-arguments-helper.component';
import {ResolverPaginationArgumentsInterface} from './pagination-argument/resolver-pagination-arguments.interface';
import {ResolverCommandLogEntryFilterArgumentsInterface} from './filter-argument/resolver-command-log-entry-filter-arguments.interface';
import {CommandLogRepository} from '../../persistence/repository/command-log.repository';

@Injectable()
export class CommandLogsResolverFactory {
    constructor(
        private readonly resolveListOptionsHelper: ResolverPaginationArgumentsHelper,
        private readonly commandLogRepository: CommandLogRepository,
    ) { }

    public getListResolver(queryExtractor?: (object: any) => any): (object: any, args: any) => Promise<CommandLogTypeInterface[]> {
        return async (object: any, args: any): Promise<CommandLogTypeInterface[]> => {
            const resolverListOptions = args as ResolverPaginationArgumentsInterface;
            const criteria = this.applyFilterArgumentToCriteria(
                queryExtractor ? queryExtractor(object) : {},
                args as ResolverCommandLogEntryFilterArgumentsInterface,
            );
            const commandLogs = await this.commandLogRepository.find(
                {instanceId: criteria.instanceId},
                0,
                9999,
                {createdAt: 1},
            );
            const data: CommandLogTypeInterface[] = [];
            for (const commandLog of commandLogs) {
                data.push({
                    id: commandLog._id.toString(),
                    description: commandLog.description,
                    createdAt: commandLog.createdAt,
                    completedAt: commandLog.completedAt,
                    failedAt: commandLog.failedAt,
                } as CommandLogTypeInterface);
            }

            return data;
        };
    }

    protected applyFilterArgumentToCriteria(criteria: any, args: ResolverCommandLogEntryFilterArgumentsInterface): any {
        return criteria;
    }
}
