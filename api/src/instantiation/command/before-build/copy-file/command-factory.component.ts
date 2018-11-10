import * as path from 'path';
import {BeforeBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {CopyFileCommand} from './command';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {InstanceContextBeforeBuildTaskInterface} from '../../../instance-context/before-build/instance-context-before-build-task.interface';
import {InstanceContextSourceInterface} from '../../../instance-context/instance-context-source.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextCopyFileInterface} from '../../../instance-context/before-build/instance-context-copy-file.interface';
import {CommandType} from '../../../executor/command.type';

export class CopyFileCommandFactoryComponent implements BeforeBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'copy';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        beforeBuildTask: InstanceContextBeforeBuildTaskInterface,
        source: InstanceContextSourceInterface,
        taskId: string,
        instance: InstanceContext,
    ): CommandType {
        const typedBeforeBuildTask = beforeBuildTask as InstanceContextCopyFileInterface;

        return new ContextAwareCommand(
            taskId,
            instance.id,
            `Copy file for source \`${source.id}\``,
            () => new CopyFileCommand(
                path.join(source.paths.dir.absolute.guest, typedBeforeBuildTask.sourceRelativePath),
                path.join(source.paths.dir.absolute.guest, typedBeforeBuildTask.destinationRelativePath),
            ),
        );
    }

}
