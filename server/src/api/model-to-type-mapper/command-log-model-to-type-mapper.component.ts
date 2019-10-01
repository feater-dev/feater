import { CommandLogTypeInterface } from '../type/command-log-type.interface';
import { CommandLogInterface } from '../../persistence/interface/command-log.interface';
import { DateConverter } from '../date-converter.component';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandLogModelToTypeMapper {
    constructor(private readonly dateConverter: DateConverter) {}

    mapOne(commandLog: CommandLogInterface): CommandLogTypeInterface {
        return {
            id: commandLog._id.toString(),
            description: commandLog.description,
            createdAt: this.dateConverter.convertDate(commandLog.createdAt),
            completedAt: this.dateConverter.convertDate(commandLog.completedAt),
            failedAt: this.dateConverter.convertDate(commandLog.failedAt),
        } as CommandLogTypeInterface;
    }

    mapMany(commandLogs: CommandLogInterface[]): CommandLogTypeInterface[] {
        return commandLogs.map(
            (commandLog: CommandLogInterface): CommandLogTypeInterface => {
                return this.mapOne(commandLog);
            },
        );
    }
}
