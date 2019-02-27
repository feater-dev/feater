import * as path from 'path';
import {BeforeBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {InterpolateFileCommand} from './command';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {InterpolateFileCommandResultInterface} from './command-result.interface';
import {InstanceContextBeforeBuildTaskInterface} from '../../../instance-context/before-build/instance-context-before-build-task.interface';
import {InstanceContextSourceInterface} from '../../../instance-context/instance-context-source.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextInterpolateFileInterface} from '../../../instance-context/before-build/instance-context-interpolate-file.interface';
import {FeaterVariablesSet} from '../../../sets/feater-variables-set';
import {CommandType} from '../../../executor/command.type';
import {Injectable} from '@nestjs/common';

@Injectable()
export class InterpolateFileCommandFactoryComponent implements BeforeBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'interpolate';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        beforeBuildTask: InstanceContextBeforeBuildTaskInterface,
        source: InstanceContextSourceInterface,
        taskId: string,
        instance: InstanceContext,
        updateInstanceFromInstanceContext: () => Promise<void>,
    ): CommandType {
        const typedBeforeBuildTask = beforeBuildTask as InstanceContextInterpolateFileInterface;

        return new ContextAwareCommand(
            taskId,
            instance.id,
            `Interpolate file for source \`${source.id}\``,
            () => new InterpolateFileCommand(
                instance.featerVariables,
                path.join(source.paths.absolute.guest, typedBeforeBuildTask.relativePath),
            ),
            async (result: InterpolateFileCommandResultInterface): Promise<void> => {
                (beforeBuildTask as InstanceContextInterpolateFileInterface).interpolatedText = result.interpolatedText;
            },
        );
    }

}
