import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveProperty,
    Resolver,
} from '@nestjs/graphql';
import { DefinitionModelToTypeMapper } from '../model-to-type-mapper/definition-model-to-type-mapper.component';
import { ResolverPaginationArgumentsInterface } from '../pagination-argument/resolver-pagination-arguments.interface';
import { InstanceTypeInterface } from '../type/instance-type.interface';
import { ResolverInstanceFilterArgumentsInterface } from '../filter-argument/resolver-instance-filter-arguments.interface';
import { InstanceModelToTypeMapper } from '../model-to-type-mapper/instance-model-to-type-mapper.component';
import { InstanceLister } from '../lister/instance-lister.component';
import { InstanceRepository } from '../../persistence/repository/instance.repository';
import { CreateInstanceInputTypeInterface } from '../input-type/create-instance-input-type.interface';
import { StopServiceInputTypeInterface } from '../input-type/stop-service-input-type.interface';
import { execSync } from 'child_process';
import { config } from '../../config/config';
import { PauseServiceInputTypeInterface } from '../input-type/pause-service-input-type.interface';
import { StartServiceInputTypeInterface } from '../input-type/start-service-input-type.interface';
import { UnpauseServiceInputTypeInterface } from '../input-type/unpause-service-input-type.interface';
import { RemoveInstanceInputTypeInterface } from '../input-type/remove-instance-input-type.interface';
import { DefinitionRepository } from '../../persistence/repository/definition.repository';
import { InstanceCreatorComponent } from '../../instantiation/instance-creator.component';
import { DefinitionTypeInterface } from '../type/definition-type.interface';
import { CommandLogTypeInterface } from '../type/command-log-type.interface';
import { CommandLogRepository } from '../../persistence/repository/command-log.repository';
import { CommandLogModelToTypeMapper } from '../model-to-type-mapper/command-log-model-to-type-mapper.component';
import * as escapeStringRegexp from 'escape-string-regexp';
import * as nanoidGenerate from 'nanoid/generate';
import * as path from 'path';

@Resolver('Instance')
export class InstanceResolver {
    constructor(
        private readonly instanceRepository: InstanceRepository,
        private readonly instanceLister: InstanceLister,
        private readonly instanceModelToTypeMapper: InstanceModelToTypeMapper,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instantiator: InstanceCreatorComponent,
        private readonly definitionModelToTypeMapper: DefinitionModelToTypeMapper,
        private readonly commandLogRepository: CommandLogRepository,
        private readonly commandLogModelToTypeMapper: CommandLogModelToTypeMapper,
    ) {}

    @Query('instances')
    async getAll(@Args() args?: any): Promise<InstanceTypeInterface[]> {
        const criteria = this.applyInstanceFilterArgumentToCriteria(
            {},
            args as ResolverInstanceFilterArgumentsInterface,
        );
        const instances = await this.instanceLister.getList(
            criteria,
            args as ResolverPaginationArgumentsInterface,
        );

        return this.instanceModelToTypeMapper.mapMany(instances);
    }

    @Query('instance')
    async getOne(@Args('id') id: string): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findById(id);

        return this.instanceModelToTypeMapper.mapOne(instance);
    }

    @ResolveProperty('definition')
    async getDefinition(
        @Parent() instance: InstanceTypeInterface,
    ): Promise<DefinitionTypeInterface> {
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        return this.definitionModelToTypeMapper.mapOne(definition);
    }

    @ResolveProperty('commandLogs')
    async getCommandLogs(
        @Parent() instance: InstanceTypeInterface,
    ): Promise<CommandLogTypeInterface[]> {
        const criteria = { instanceId: instance.id };
        // TODO Introduce dedicated command log lister.
        const commandLogs = await this.commandLogRepository.find(
            criteria,
            0,
            999999,
            { _id: 1 },
        );

        return this.commandLogModelToTypeMapper.mapMany(commandLogs);
    }

    @Mutation('createInstance')
    async create(
        @Args() createInstanceInput: CreateInstanceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        // TODO Add validation.
        const instance = await this.instanceRepository.create(
            createInstanceInput,
        );
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );
        const hash = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8);

        process.nextTick(() => {
            this.instantiator.createInstance(instance, hash, definition);
        });

        return this.instanceModelToTypeMapper.mapOne(instance);
    }

    @Mutation('removeInstance')
    async remove(
        @Args() removeInstanceInput: RemoveInstanceInputTypeInterface,
    ): Promise<boolean> {
        const instance = await this.instanceRepository.findById(
            removeInstanceInput.id,
        );
        execSync('bash -c remove-instance.sh', {
            cwd: path.join(config.guestPaths.root, 'bin'),
            env: {
                INSTANCE_HASH: instance.hash,
                COMPOSE_PROJECT_NAME_PREFIX: `${config.instantiation.containerNamePrefix}${instance.hash}`,
                FEATER_GUEST_PATH_BUILD: config.guestPaths.build,
                FEATER_GUEST_PATH_PROXY: config.guestPaths.proxy,
            },
        });

        return await this.instanceRepository.remove(removeInstanceInput.id);
    }

    @Mutation('stopService')
    async stopService(
        @Args() stopServiceInput: StopServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        // TODO Add validation.
        const instance = await this.instanceRepository.findById(
            stopServiceInput.instanceId,
        );
        for (const service of instance.services) {
            if (stopServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} stop ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance);
    }

    @Mutation('pauseService')
    async pauseService(
        @Args() pauseServiceInput: PauseServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        // TODO Add validation.
        const instance = await this.instanceRepository.findById(
            pauseServiceInput.instanceId,
        );
        for (const service of instance.services) {
            if (pauseServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} pause ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance);
    }

    @Mutation('startService')
    async startService(
        @Args() startServiceInput: StartServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        // TODO Add validation.
        const instance = await this.instanceRepository.findById(
            startServiceInput.instanceId,
        );
        for (const service of instance.services) {
            if (startServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} start ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance);
    }

    @Mutation('unpauseService')
    async unpauseService(
        @Args() unpauseServiceInput: UnpauseServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        // TODO Add validation.
        const instance = await this.instanceRepository.findById(
            unpauseServiceInput.instanceId,
        );
        for (const service of instance.services) {
            if (unpauseServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} unpause ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance);
    }

    // TODO Move somewhere else.
    protected applyInstanceFilterArgumentToCriteria(
        criteria: any,
        args: ResolverInstanceFilterArgumentsInterface,
    ): object {
        if (args.name) {
            criteria.name = new RegExp(escapeStringRegexp(args.name));
        }
        if (args.projectId) {
            criteria.projectId = args.projectId;
        }
        if (args.definitionId) {
            criteria.definitionId = args.definitionId;
        }

        return criteria;
    }
}
