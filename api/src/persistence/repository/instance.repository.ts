import {Model, Types} from 'mongoose';
import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceSchema} from '../schema/instance.schema';
import {InstanceInterface} from '../interface/instance.interface';
import {CreateInstanceRequestDto} from '../../api/dto/request/create-instance-request.dto';

@Component()
export class InstanceRepository {

    constructor(
        @InjectModel(InstanceSchema) private readonly instanceModel: Model<InstanceInterface>,
    ) {}

    find(query: any): Promise<InstanceInterface[]> {
        return this.instanceModel.find(query).exec();
    }

    findById(id: string): Promise<InstanceInterface> {
        return this.instanceModel.findById(id).exec();
    }

    findByHash(hash: string): Promise<InstanceInterface> {
        return this.instanceModel.find({ hash }).exec();
    }

    async findByIdOrFail(id: string): Promise<InstanceInterface> {
        const instance = await this.findById(id);
        if (null === instance) {
            throw new Error(`Instance document with id ${id} not found.`);
        }

        return instance;
    }

    create(createInstanceDto: CreateInstanceRequestDto): Promise<InstanceInterface> {
        const createdInstance = new this.instanceModel(createInstanceDto);

        return new Promise(resolve => {
            createdInstance.save();
            resolve(createdInstance);
        });
    }

    async remove(id: string): Promise<boolean> {
        const removal = await this.instanceModel.findByIdAndRemove(id);

        return true;
    }

    async updateServices(build: any): Promise<any> {
        const persistentBuild = await this.findById(build.id);
        if (null === persistentBuild) {
            throw new Error();
        }
        persistentBuild.set({services: build.services});
        await persistentBuild.save();
    }

    async updateSummaryItems(build: any): Promise<any> {
        const persistentBuild = await this.findById(build.id);
        if (null === persistentBuild) {
            throw new Error();
        }
        persistentBuild.set({summaryItems: build.summaryItems.toList()});
        await persistentBuild.save();
    }

    async updateEnvironmentalVariables(build: any): Promise<any> {
        const persistentBuild = await this.findById(build.id);
        if (null === persistentBuild) {
            throw new Error();
        }
        persistentBuild.set({environmentalVariables: build.environmentalVariables.toList()});
        await persistentBuild.save();
    }
}
