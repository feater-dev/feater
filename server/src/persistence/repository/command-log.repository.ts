import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommandLogInterface } from '../interface/command-log.interface';

@Injectable()
export class CommandLogRepository {
    constructor(
        @InjectModel('CommandLog')
        private readonly commandLogModel: Model<CommandLogInterface>,
    ) {}

    find(
        criteria: object,
        offset: number,
        limit: number,
        sort?: object,
    ): Promise<CommandLogInterface[]> {
        const query = this.commandLogModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    create(
        taskId: string,
        instanceId: string,
        description: string,
    ): Promise<CommandLogInterface> {
        const createdCommandLog = new this.commandLogModel({
            taskId,
            instanceId,
            description,
            details: [],
            createdAt: new Date(),
        } as CommandLogInterface);

        return createdCommandLog.save();
    }
}
