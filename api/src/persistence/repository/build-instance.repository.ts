import {Model, Types} from 'mongoose';
import {Component} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {BuildInstanceSchema} from '../schema/build-instance.schema';
import {BuildInstanceInterface} from '../interface/build-instance.interface';
import {CreateBuildInstanceRequestDto} from '../../api/dto/request/create-build-instance-request.dto';

@Component()
export class BuildInstanceRepository {

    constructor(
        @InjectModel(BuildInstanceSchema) private readonly buildInstanceModel: Model<BuildInstanceInterface>,
    ) {}

    find(query: any): Promise<BuildInstanceInterface[]> {
        return this.buildInstanceModel.find(query).exec();
    }

    findById(id: string): Promise<BuildInstanceInterface> {
        return this.buildInstanceModel.findById(id).exec();
    }

    findByHash(hash: string): Promise<BuildInstanceInterface> {
        return this.buildInstanceModel.find({ hash }).exec();
    }

    async findByIdOrFail(id: string): Promise<BuildInstanceInterface> {
        const buildInstance = await this.findById(id);
        if (null === buildInstance) {
            throw new Error(`BuildInstance document with id ${id} not found.`);
        }

        return buildInstance;
    }

    create(createBuildInstanceDto: CreateBuildInstanceRequestDto): Promise<BuildInstanceInterface> {
        const createdBuildInstance = new this.buildInstanceModel(createBuildInstanceDto);

        return new Promise(resolve => {
            createdBuildInstance.save();
            resolve(createdBuildInstance);
        });
    }

    async remove(id: string): Promise<boolean> {
        const removal = await this.buildInstanceModel.findByIdAndRemove(id);

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
