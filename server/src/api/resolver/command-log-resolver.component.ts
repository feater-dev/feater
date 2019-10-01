import { CommandLogTypeInterface } from '../type/command-log-type.interface';
import { ResolverInstanceCommandLogEntryFilterArgumentsInterface } from '../filter-argument/resolver-instance-command-log-entry-filter-arguments.interface';
import { Args, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { LogTypeInterface } from '../type/log-type.interface';
import { LogRepository } from '../../persistence/repository/log.repository';
import { LogModelToTypeMapper } from '../model-to-type-mapper/log-model-to-type-mapper.component';
import * as mongoose from 'mongoose';

@Resolver('InstanceCommandLog')
export class CommandLogResolver {
    constructor(
        private readonly logRepository: LogRepository,
        private readonly logModelToTypeMapper: LogModelToTypeMapper,
    ) {}

    @ResolveProperty('entries')
    async getEntries(
        @Parent() instanceCommandLog: CommandLogTypeInterface,
        @Args() args: any,
    ): Promise<LogTypeInterface[]> {
        const criteria = this.applyInstanceCommandLogEntryFilterArgumentToCriteria(
            { 'meta.commandLogId': instanceCommandLog.id },
            args as ResolverInstanceCommandLogEntryFilterArgumentsInterface,
        );
        const logs = await this.logRepository.find(criteria, 0, 999999, {
            _id: 1,
        });

        return this.logModelToTypeMapper.mapMany(logs);
    }

    // TODO Move somewhere else.
    protected applyInstanceCommandLogEntryFilterArgumentToCriteria(
        criteria: any,
        args: ResolverInstanceCommandLogEntryFilterArgumentsInterface,
    ): any {
        if (args.afterId) {
            criteria._id = { $gt: new mongoose.Types.ObjectId(args.afterId) };
        }

        return criteria;
    }
}
