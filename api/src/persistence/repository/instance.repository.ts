import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {InstanceInterface} from '../interface/instance.interface';
import {CreateInstanceInputTypeInterface} from '../../graphql/input-type/create-instance-input-type.interface';

@Injectable()
export class InstanceRepository {

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

    create(createInstanceInputType: CreateInstanceInputTypeInterface): Promise<InstanceInterface> {
        const createdInstance = new this.instanceModel(createInstanceInputType);
        createdInstance.createdAt = new Date();

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
        const persistentInstance = await this.findById(build.id);
        if (null === persistentInstance) {
            throw new Error();
        }
        const mappedServices = [];
        const mappedProxiedPorts = [];
        for (const serviceId of Object.keys(build.services)) {
            const service = build.services[serviceId];
            mappedServices.push({
                id: serviceId,
                containerNamePrefix: service.containerNamePrefix,
                containerId: service.containerId,
                ipAddress: service.ipAddress,
            });
            for (const proxiedPort of service.proxiedPorts) {
                mappedProxiedPorts.push({
                    id: proxiedPort.id,
                    name: proxiedPort.name,
                    serviceId: proxiedPort.serviceId,
                    port: proxiedPort.port,
                    proxyDomain: proxiedPort.proxyDomain,
                });
            }
        }
        persistentInstance.set({services: mappedServices});
        persistentInstance.set({proxiedPorts: mappedProxiedPorts});
        await persistentInstance.save();
    }

    async updateSummaryItems(build: any): Promise<any> {
        const persistentInstance = await this.findById(build.id);
        if (null === persistentInstance) {
            throw new Error();
        }
        const mappedSummaryItems = [];
        for (const summaryItem of build.summaryItems.toList()) {
            mappedSummaryItems.push({
                name: summaryItem.name,
                text: summaryItem.value,
            });
        }
        persistentInstance.set({summaryItems: mappedSummaryItems});
        await persistentInstance.save();
    }

    async updateEnvVariables(build: any): Promise<any> {
        const persistentInstance = await this.findById(build.id);
        if (null === persistentInstance) {
            throw new Error();
        }
        const mappedEnvVariables = [];
        for (const envVariable of build.envVariables.toList()) {
            mappedEnvVariables.push({
                name: envVariable.key,
                value: envVariable.value,
            });
        }
        persistentInstance.set({envVariables: mappedEnvVariables});
        await persistentInstance.save();
    }

    async setIpAddressForServices(serviceIdAndIpAddressList: any[]): Promise<void> {} // TODO

}
