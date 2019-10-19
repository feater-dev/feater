import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandLogInterface } from '../interface/command-log.interface';

@Injectable()
export class CommandLogRepository {
    constructor(
        @InjectModel('CommandLog')
        public readonly commandLogModel: Model<CommandLogInterface>,
    ) {}

    find(
        criteria: unknown,
        offset: number,
        limit: number,
        sort?: unknown,
    ): Promise<CommandLogInterface[]> {
        const query = this.commandLogModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    create(
        actionLogId: string,
        instanceId: string,
        instanceHash: string,
        description: string,
    ): Promise<CommandLogInterface> {
        const createdCommandLog = new this.commandLogModel({
            actionLogId,
            instanceId,
            instanceHash,
            description,
            createdAt: new Date(),
        } as CommandLogInterface);

        return createdCommandLog.save();
    }
}
