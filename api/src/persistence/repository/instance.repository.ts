import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceInterface} from '../interface/instance.interface';
import {CreateInstanceInputTypeInterface} from '../../graphql/input-type/create-instance-input-type.interface';
import {InstanceContext} from '../../instantiation/instance-context/instance-context';

@Injectable()
export class InstanceRepository {

    protected instancesSaveBuffer: {
        instance: InstanceInterface,
        resolve: (instance: InstanceInterface) => void,
    }[] = [];

    constructor(
        @InjectModel('Instance') private readonly instanceModel: Model<InstanceInterface>,
    ) {}

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
        await instance.save();

        return instance;
    }

    async remove(id: string): Promise<boolean> {
        const removal = await this.instanceModel.findByIdAndRemove(id);

        return true;
    }

    save(instance: InstanceInterface): Promise<InstanceInterface> {
        instance.updatedAt = new Date();

        return new Promise<InstanceInterface>(resolve => {
            this.instancesSaveBuffer.push({
                instance,
                resolve,
            });
            this.saveNextFromBuffer();
        });
    }

    protected async saveNextFromBuffer(): Promise<void> {
        if (0 === this.instancesSaveBuffer.length) {
            return;
        }
        const {instance, resolve} = await this.instancesSaveBuffer[0];
        await instance.save();
        resolve(instance);
        this.instancesSaveBuffer = this.instancesSaveBuffer.slice(1);
        this.saveNextFromBuffer();
    }
}
