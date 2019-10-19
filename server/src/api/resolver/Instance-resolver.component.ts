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
import { DefinitionTypeInterface } from '../type/definition-type.interface';
import { CommandLogRepository } from '../../persistence/repository/command-log.repository';
import { ModifyInstanceInputTypeInterface } from '../input-type/modify-instance-input-type.interface';
import { ActionLogTypeInterface } from '../type/action-log-type.interface';
import { ActionLogRepository } from '../../persistence/repository/action-log.repository';
import * as escapeStringRegexp from 'escape-string-regexp';
import * as nanoidGenerate from 'nanoid/generate';
import * as path from 'path';
import { Instantiator } from '../../instantiation/instantiator.service';
import { Modificator } from '../../instantiation/modificator.service';

@Resolver('Instance')
export class InstanceResolver {
    constructor(
        private readonly instanceRepository: InstanceRepository,
        private readonly instanceLister: InstanceLister,
        private readonly instanceModelToTypeMapper: InstanceModelToTypeMapper,
        private readonly definitionRepository: DefinitionRepository,
        private readonly instantiator: Instantiator,
        private readonly modificator: Modificator,
        private readonly definitionModelToTypeMapper: DefinitionModelToTypeMapper,
        private readonly actionLogRepository: ActionLogRepository,
        private readonly commandLogRepository: CommandLogRepository,
    ) {}

    @Query('instances')
    async getAll(
        @Args()
        args?: ResolverInstanceFilterArgumentsInterface &
            ResolverPaginationArgumentsInterface,
    ): Promise<InstanceTypeInterface[]> {
        const criteria = this.applyInstanceFilterArgumentToCriteria({}, args);
        const instances = await this.instanceLister.getList(criteria, args);

        const mappedInstances: InstanceTypeInterface[] = [];
        for (const instance of instances) {
            const definition = await this.definitionRepository.findByIdOrFail(
                instance.definitionId,
            );
            mappedInstances.push(
                this.instanceModelToTypeMapper.mapOne(instance, definition),
            );
        }

        return mappedInstances;
    }

    @Query('instance')
    async getOne(@Args('id') id: string): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findByIdOrFail(id);
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
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

    @ResolveProperty('actionLogs')
    async getActionLogs(
        @Parent() instance: InstanceTypeInterface,
    ): Promise<ActionLogTypeInterface[]> {
        const actionLogs = await this.actionLogRepository.find(
            { instanceId: instance.id },
            0,
            999999,
            { _id: 1 },
        );

        const mappedActionLogs: ActionLogTypeInterface[] = [];

        for (const actionLog of actionLogs) {
            mappedActionLogs.push({
                id: actionLog._id.toString(),
                actionId: actionLog.actionId,
                actionType: actionLog.actionType,
                actionName: actionLog.actionName,
                createdAt: actionLog.createdAt,
                completedAt: actionLog.completedAt,
                failedAt: actionLog.failedAt,
            });
        }

        return mappedActionLogs;
    }

    @Mutation('createInstance')
    async create(
        @Args() createInstanceInput: CreateInstanceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        const definition = await this.definitionRepository.findByIdOrFail(
            createInstanceInput.definitionId,
        );

        const instance = await this.instanceRepository.create(
            createInstanceInput,
        );

        const instanceHash = nanoidGenerate(
            '0123456789abcdefghijklmnopqrstuvwxyz',
            8,
        );

        process.nextTick(() => {
            this.instantiator.createInstance(
                definition,
                instanceHash,
                createInstanceInput.instantiationActionId,
                instance,
            );
        });

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
    }

    @Mutation('modifyInstance')
    async modify(
        @Args() modifyInstanceInput: ModifyInstanceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findByIdOrFail(
            modifyInstanceInput.instanceId,
        );

        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        if (definition.updatedAt > instance.createdAt) {
            throw new Error(
                'Cannot modify this instance as related definition was subsequently modified.',
            );
        }

        process.nextTick(() => {
            this.modificator.modifyInstance(
                definition,
                modifyInstanceInput.modificationActionId,
                instance,
            );
        });

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
    }

    @Mutation('removeInstance')
    async remove(
        @Args() removeInstanceInput: RemoveInstanceInputTypeInterface,
    ): Promise<boolean> {
        const instance = await this.instanceRepository.findByIdOrFail(
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

        await this.actionLogRepository.actionLogModel.deleteMany({
            instanceId: instance._id.toString(),
        });
        await this.commandLogRepository.commandLogModel.deleteMany({
            instanceId: instance._id.toString(),
        });
        await this.instanceRepository.remove(removeInstanceInput.id);

        return true;
    }

    @Mutation('stopService')
    async stopService(
        @Args() stopServiceInput: StopServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findByIdOrFail(
            stopServiceInput.instanceId,
        );
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        for (const service of instance.services) {
            if (stopServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} stop ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
    }

    @Mutation('pauseService')
    async pauseService(
        @Args() pauseServiceInput: PauseServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findByIdOrFail(
            pauseServiceInput.instanceId,
        );
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        for (const service of instance.services) {
            if (pauseServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} pause ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
    }

    @Mutation('startService')
    async startService(
        @Args() startServiceInput: StartServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findByIdOrFail(
            startServiceInput.instanceId,
        );
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        for (const service of instance.services) {
            if (startServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} start ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
    }

    @Mutation('unpauseService')
    async unpauseService(
        @Args() unpauseServiceInput: UnpauseServiceInputTypeInterface,
    ): Promise<InstanceTypeInterface> {
        const instance = await this.instanceRepository.findByIdOrFail(
            unpauseServiceInput.instanceId,
        );
        const definition = await this.definitionRepository.findByIdOrFail(
            instance.definitionId,
        );

        for (const service of instance.services) {
            if (unpauseServiceInput.serviceId === service.id) {
                execSync(
                    `${config.instantiation.dockerBinaryPath} unpause ${service.containerId}`,
                );

                break;
            }
        }

        return this.instanceModelToTypeMapper.mapOne(instance, definition);
    }

    // TODO Move somewhere else.
    private applyInstanceFilterArgumentToCriteria(
        criteria: unknown,
        args: ResolverInstanceFilterArgumentsInterface,
    ): unknown {
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
