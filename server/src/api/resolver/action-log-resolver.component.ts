import { CommandLogTypeInterface } from '../type/command-log-type.interface';
import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { CommandLogRepository } from '../../persistence/repository/command-log.repository';
import { PathHelper } from '../../instantiation/helper/path-helper.component';
import { ActionLogTypeInterface } from '../type/action-log-type.interface';
import * as os from 'os';
import * as fs from 'fs';

@Resolver('InstanceActionLog')
export class ActionLogResolver {
    constructor(
        private readonly commandLogRepository: CommandLogRepository,
        private readonly pathHelper: PathHelper,
    ) {}

    @ResolveProperty('commandLogs')
    async getEntries(
        @Parent() actionLog: ActionLogTypeInterface,
    ): Promise<CommandLogTypeInterface[]> {
        const commandLogs = await this.commandLogRepository.find(
            { actionLogId: actionLog.id },
            0,
            999999,
            { _id: 1 },
        );

        const mappedCommandLogs: CommandLogTypeInterface[] = [];

        for (const commandLog of commandLogs) {
            const commandLogPath = this.pathHelper.getCommandLogPaths(
                commandLog.instanceHash,
                commandLog._id.toString(),
            );

            const commandLogEntries = fs
                .readFileSync(commandLogPath.absolute.guest)
                .toString()
                .split(os.EOL)
                .filter((entry: string) => {
                    return '' !== entry;
                })
                .map((entry: string) => {
                    const parsedEntry = JSON.parse(entry);

                    return {
                        level: parsedEntry.level,
                        message: parsedEntry.message,
                    };
                });

            mappedCommandLogs.push({
                id: commandLog._id.toString(),
                description: commandLog.description,
                createdAt: commandLog.createdAt,
                completedAt: commandLog.completedAt,
                failedAt: commandLog.failedAt,
                entries: commandLogEntries,
            });
        }

        return mappedCommandLogs;
    }
}
