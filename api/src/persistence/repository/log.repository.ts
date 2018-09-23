import {Model, Types} from 'mongoose';
import {Component} from '@nestjs/common';
import {LogInterface} from '../interface/log.interface';
import {InjectModel} from '@nestjs/mongoose';
import {AssetInterface} from '../interface/asset.interface';
import {LogSchema} from '../schema/log.schema';

@Component()
export class LogRepository {

    constructor(
        @InjectModel(LogSchema) private readonly logModel: Model<LogInterface>,
    ) {}

    async find(criteria: object, offset: number, limit: number, sort?: object): Promise<LogInterface[]> {
        const query = this.logModel.find(criteria);
        query
            .skip(offset)
            .limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    async findByInstanceId(instanceId: string): Promise<LogInterface[]> {
        return await this.find({'meta.build.id': instanceId}, 0, 99999);
    }
}
