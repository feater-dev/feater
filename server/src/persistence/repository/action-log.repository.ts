import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActionLogInterface } from '../interface/action-log.interface';

@Injectable()
export class ActionLogRepository {
    constructor(
        @InjectModel('ActionLog')
        public readonly actionLogModel: Model<ActionLogInterface>,
    ) {}

    find(
        criteria: unknown,
        offset: number,
        limit: number,
        sort?: unknown,
    ): Promise<ActionLogInterface[]> {
        const query = this.actionLogModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    create(
        instanceId: string,
        actionId: string,
        actionType: string,
        actionName: string,
    ): Promise<ActionLogInterface> {
        const createdActionLog = new this.actionLogModel({
            instanceId,
            actionId,
            actionType,
            actionName,
            createdAt: new Date(),
        } as ActionLogInterface);

        return createdActionLog.save();
    }
}
