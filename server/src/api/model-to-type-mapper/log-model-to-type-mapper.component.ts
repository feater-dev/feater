import {DateConverter} from '../date-converter.component';
import {Injectable} from '@nestjs/common';
import {LogInterface} from '../../persistence/interface/log.interface';
import {LogTypeInterface} from '../type/log-type.interface';

@Injectable()
export class LogModelToTypeMapper {
    constructor(
        private readonly dateConverter: DateConverter,
    ) { }

    mapOne(log: LogInterface): LogTypeInterface {
        return {
            id: log._id.toString(),
            message: log.message,
            timestamp: this.dateConverter.convertDate(log.timestamp),
        } as LogTypeInterface;
    }

    mapMany(logs: LogInterface[]): LogTypeInterface[] {
        return logs.map(
            (log: LogInterface): LogTypeInterface => {
                return this.mapOne(log);
            },
        );
    }
}
