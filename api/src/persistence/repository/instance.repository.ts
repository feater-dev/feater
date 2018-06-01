import {Model, Types} from 'mongoose';
import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceSchema} from '../schema/instance.schema';
import {InstanceInterface} from '../interface/instance.interface';
import {CreateInstanceRequestDto} from '../../api/dto/request/create-instance-request.dto';
import {DefinitionInterface} from '../interface/definition.interface';

@Component()
export class InstanceRepository {

    constructor(
        @InjectModel(InstanceSchema) private readonly instanceModel: Model<InstanceInterface>,
    ) {}

    find(criteria: object, offset: number, limit: number, sort?: object): Promise<InstanceInterface[]> {
        const query = this.instanceModel.find(criteria);
        query.skip(offset).limit(limit);
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
