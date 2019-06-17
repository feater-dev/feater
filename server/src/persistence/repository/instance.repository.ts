import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceInterface} from '../interface/instance.interface';
import {CreateInstanceInputTypeInterface} from '../../api/input-type/create-instance-input-type.interface';
import {InstanceContext} from '../../instantiation/instance-context/instance-context';

@Injectable()
export class InstanceRepository {

    protected saveInSequencePromise: Promise<void>;

    constructor(
        @InjectModel('Instance') private readonly instanceModel: Model<InstanceInterface>,
    ) {
        this.saveInSequencePromise = new Promise<void>((resolve) => {
            resolve();
        });
    }

    find(criteria: object, offset: number, limit: number, sort?: object): Promise<InstanceInterface[]> {
        const query = this.instanceModel.find(criteria);
        query
            .skip(offset)
            .limit(limit);
        if (sort) {
            query.sort(sort);
        }

        return query.exec();
    }

    findById(id: string): Promise<InstanceInterface> {
        return this.instanceModel.findById(id).exec();
    }

    async findByIdOrFail(id: string): Promise<InstanceInterface> {
        const instance = await this.findById(id);
        if (null === instance) {
            throw new Error(`Instance document with id ${id} not found.`);
        }

        return instance;
    }

    async create(createInstanceInputType: CreateInstanceInputTypeInterface): Promise<InstanceInterface> {
        const instance = new this.instanceModel(createInstanceInputType);
        instance.createdAt = new Date();
        instance.updatedAt = new Date();
        await instance.save();

        return instance;
    }

    async remove(id: string): Promise<boolean> {
        await this.instanceModel.findByIdAndRemove(id);

        return true;
    }

    save(instance: InstanceInterface): Promise<InstanceInterface> {
        instance.updatedAt = new Date();

        return new Promise<InstanceInterface>((resolve) => {
            this.saveInSequencePromise = this.saveInSequencePromise.then(async () => {
                await instance.save();
                resolve(instance);

                return;
            });
        });
    }
}
