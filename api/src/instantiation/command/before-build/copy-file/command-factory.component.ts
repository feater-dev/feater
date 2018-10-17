import * as path from 'path';
import {BeforeBuildTaskCommandFactoryInterface} from '../command-factory.interface';
import {CopyFileCommand} from './command';
import {ContextAwareCommand} from '../../../executor/context-aware-command.interface';
import {CommandInterface} from '../../../executor/command.interface';
import {InstanceContextBeforeBuildTaskInterface} from '../../../instance-context/before-build/instance-context-before-build-task.interface';
import {InstanceContextSourceInterface} from '../../../instance-context/instance-context-source.interface';
import {InstanceContext} from '../../../instance-context/instance-context';
import {InstanceContextCopyFileInterface} from '../../../instance-context/before-build/instance-context-copy-file.interface';

export class CopyFileCommandFactoryComponent implements BeforeBuildTaskCommandFactoryInterface {

    protected readonly TYPE = 'copy';

    supportsType(type: string): boolean {
        return this.TYPE === type;
    }

    createCommand(
        type: string,
        beforeBuildTask: InstanceContextBeforeBuildTaskInterface,
        source: InstanceContextSourceInterface,
        instance: InstanceContext,
    ): CommandInterface {
        const typedBeforeBuildTask = beforeBuildTask as InstanceContextCopyFileInterface;

        return new ContextAwareCommand(
            (instance: InstanceContext) => new CopyFileCommand(
                path.join(source.paths.dir.absolute.guest, typedBeforeBuildTask.sourceRelativePath),
                path.join(source.paths.dir.absolute.guest, typedBeforeBuildTask.destinationRelativePath),
            ),
        );
    }

}
