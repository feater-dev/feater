import { Injectable } from '@nestjs/common';
import { BaseLogger } from '../logger/base-logger';
import { CommandsList } from './executor/commands-list';
import { ContextAwareCommand } from './executor/context-aware-command.interface';
import { ResetSourceCommand } from './command/reset-source/command';
import { CopyFileCommandFactoryComponent } from './command/before-build/copy-file/command-factory.component';
import { InterpolateFileCommandFactoryComponent } from './command/before-build/interpolate-file/command-factory.component';
import { BeforeBuildTaskCommandFactoryInterface } from './command/before-build/command-factory.interface';
import { CopyAssetIntoContainerCommandFactoryComponent } from './command/after-build/copy-asset-into-container/command-factory.component';
import { ExecuteServiceCmdCommandFactoryComponent } from './command/after-build/execute-service-cmd/command-factory.component';
import { AfterBuildTaskCommandFactoryInterface } from './command/after-build/command-factory.interface';
import { CommandExecutorComponent } from './executor/command-executor.component';
import { ActionExecutionContextSourceInterface } from './action-execution-context/action-execution-context-source.interface';
import { ActionExecutionContextAfterBuildTaskInterface } from './action-execution-context/after-build/action-execution-context-after-build-task.interface';
import { ActionExecutionContextBeforeBuildTaskInterface } from './action-execution-context/before-build/action-execution-context-before-build-task.interface';
import { ActionExecutionContext } from './action-execution-context/action-execution-context';
import { ActionExecutionContextFactory } from './action-execution-context-factory.component';
import { CommandType } from './executor/command.type';
import { CommandsMap } from './executor/commands-map';
import { CommandsMapItem } from './executor/commands-map-item';
import { InstanceInterface } from '../persistence/interface/instance.interface';
import { DefinitionInterface } from '../persistence/interface/definition.interface';
import { InstanceRepository } from '../persistence/repository/instance.repository';
import { ActionLogRepository } from '../persistence/repository/action-log.repository';
import * as _ from 'lodash';
import { RecipeMapper } from '../api/recipe/schema-version/0-1/recipe-mapper';
import {
    ActionInterface,
    RecipeInterface,
} from '../api/recipe/recipe.interface';

@Injectable()
export class Modificator {
    private readonly beforeBuildTaskCommandFactoryComponents: BeforeBuildTaskCommandFactoryInterface[];
    private readonly afterBuildTaskCommandFactoryComponents: AfterBuildTaskCommandFactoryInterface[];

    constructor(
        private readonly instanceRepository: InstanceRepository,
        private readonly actionLogRepository: ActionLogRepository,
        private readonly actionExecutionContextFactory: ActionExecutionContextFactory,
        private readonly logger: BaseLogger,
        private readonly commandExecutorComponent: CommandExecutorComponent,
        private readonly recipeMapper: RecipeMapper,
        copyFileCommandFactoryComponent: CopyFileCommandFactoryComponent,
        interpolateFileCommandFactoryComponent: InterpolateFileCommandFactoryComponent,
        copyAssetIntoContainerCommandFactoryComponent: CopyAssetIntoContainerCommandFactoryComponent,
        executeServiceCmdCommandFactoryComponent: ExecuteServiceCmdCommandFactoryComponent,
    ) {
        this.beforeBuildTaskCommandFactoryComponents = [
            copyFileCommandFactoryComponent,
            interpolateFileCommandFactoryComponent,
        ];

        this.afterBuildTaskCommandFactoryComponents = [
            copyAssetIntoContainerCommandFactoryComponent,
            executeServiceCmdCommandFactoryComponent,
        ];
    }

    async modifyInstance(
        definition: DefinitionInterface,
        modificationActionId: string,
        instance: InstanceInterface,
    ): Promise<unknown> {
        const recipe = this.recipeMapper.map(definition.recipeAsYaml);

        const action = this.findAction(recipe, modificationActionId);

        const instanceId = instance._id.toString();

        const actionLog = await this.actionLogRepository.create(
            instanceId,
            action.id,
            action.type,
            action.name,
        );

        const actionLogId = actionLog._id.toString();

        const actionExecutionContext = this.actionExecutionContextFactory.create(
            instanceId,
            instance.hash,
            action.id,
            recipe,
        );

        // TODO Move adding services inside context factory.
        actionExecutionContext.services = _.cloneDeep(instance.services);

        const modifyInstanceCommand = new CommandsList([], false);

        const updateInstance = async (): Promise<void> => {
            await this.instanceRepository.save(instance);
        };

        instance.failedAt = undefined;
        instance.completedAt = undefined;

        await updateInstance();

        const addStageArguments = [
            modifyInstanceCommand,
            actionLogId,
            actionExecutionContext,
            updateInstance,
        ];

        const addStageMethods = [
            this.addResetSource,
            this.addBeforeBuildTasks,
            this.addAfterBuildTasks,
        ];

        for (const addStageMethod of addStageMethods) {
            addStageMethod.apply(this, addStageArguments);
        }

        return this.commandExecutorComponent
            .execute(modifyInstanceCommand)
            .then(
                async (): Promise<void> => {
                    this.logger.info('Instance modification completed.');
                    actionLog.completedAt = new Date();
                    await actionLog.save();
                    instance.completedAt = new Date();
                    await instance.save();
                },
                async (error: Error): Promise<void> => {
                    this.logger.error('Instance modification failed.');
                    actionLog.failedAt = new Date();
                    await actionLog.save();
                    instance.failedAt = new Date();
                    await instance.save();
                },
            );
    }

    private addResetSource(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.sources.map(
                    source =>
                        new ContextAwareCommand(
                            actionLogId,
                            actionExecutionContext.id,
                            actionExecutionContext.hash,
                            `Reset repository for source \`${source.id}\``,
                            () =>
                                new ResetSourceCommand(
                                    source.cloneUrl,
                                    source.useDeployKey,
                                    source.reference.type,
                                    source.reference.name,
                                    source.paths.absolute.guest,
                                ),
                        ),
                ),
                false,
            ),
        );
    }

    // TODO Extract to a separate service.
    private addBeforeBuildTasks(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        createInstanceCommand.addCommand(
            new CommandsList(
                actionExecutionContext.sources.map(
                    source =>
                        new CommandsList(
                            source.beforeBuildTasks.map(beforeBuildTask =>
                                this.createBeforeBuildTaskCommand(
                                    beforeBuildTask,
                                    source,
                                    actionLogId,
                                    actionExecutionContext,
                                    updateInstance,
                                ),
                            ),
                            false,
                        ),
                ),
                false,
            ),
        );
    }

    // TODO Extract to a separate service.
    private addAfterBuildTasks(
        createInstanceCommand: CommandsList,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): void {
        const commandMapItems: CommandsMapItem[] = actionExecutionContext.afterBuildTasks.map(
            (afterBuildTask): CommandsMapItem => {
                const command = this.createAfterBuildTaskCommand(
                    afterBuildTask,
                    actionLogId,
                    actionExecutionContext,
                    updateInstance,
                );

                return new CommandsMapItem(
                    command,
                    afterBuildTask.id,
                    afterBuildTask.dependsOn || [],
                );
            },
        );

        createInstanceCommand.addCommand(new CommandsMap(commandMapItems));
    }

    // TODO Extract to a separate service.
    private createBeforeBuildTaskCommand(
        beforeBuildTask: ActionExecutionContextBeforeBuildTaskInterface,
        source: ActionExecutionContextSourceInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): CommandType {
        for (const factory of this.beforeBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(beforeBuildTask.type)) {
                return factory.createCommand(
                    beforeBuildTask.type,
                    beforeBuildTask,
                    source,
                    actionLogId,
                    actionExecutionContext,
                    updateInstance,
                );
            }
        }

        throw new Error(
            `Unknown type of before build task ${beforeBuildTask.type} for source ${source.id}.`,
        );
    }

    // TODO Extract to a separate service.
    private createAfterBuildTaskCommand(
        afterBuildTask: ActionExecutionContextAfterBuildTaskInterface,
        actionLogId: string,
        actionExecutionContext: ActionExecutionContext,
        updateInstance: () => Promise<void>,
    ): CommandType {
        for (const factory of this.afterBuildTaskCommandFactoryComponents) {
            if (factory.supportsType(afterBuildTask.type)) {
                return factory.createCommand(
                    afterBuildTask.type,
                    afterBuildTask,
                    actionLogId,
                    actionExecutionContext,
                    updateInstance,
                );
            }
        }

        throw new Error(
            `Unknown type of after build task ${afterBuildTask.type}.`,
        );
    }

    private findAction(
        recipe: RecipeInterface,
        actionId: string,
    ): ActionInterface {
        for (const action of recipe.actions) {
            if ('modification' === action.type && actionId === action.id) {
                return action;
            }
        }

        throw new Error(`Invalid modification action '${actionId}'.`);
    }
}
