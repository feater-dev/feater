import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LogInterface } from '../interface/log.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LogRepository {
    constructor(
        @InjectModel('Log') private readonly logModel: Model<LogInterface>,
    ) {}

    async find(
        criteria: object,
        offset: number,
        limit: number,
        sort?: object,
    ): Promise<LogInterface[]> {
        const query = this.logModel.find(criteria);
        query.skip(offset).limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    async findByInstanceId(instanceId: string): Promise<LogInterface[]> {
        return await this.find({ 'meta.build.id': instanceId }, 0, 99999);
    }
}
