import {ChildProcess, spawn} from 'child_process';
import {config} from '../../config/config';
import {Injectable} from '@nestjs/common';

@Injectable()
export class DockerVolumeHelperComponent {

    spawnVolumeCreate(
        volumeName: string,
        workingDirectory: string,
    ): ChildProcess {
        return spawn(
            config.instantiation.dockerBinaryPath,
            ['volume', 'create', volumeName],
            {cwd: workingDirectory},
        );
    }

    spawnVolumeRemove(
        volumeName: string,
        workingDirectory: string,
    ): ChildProcess {
        return spawn(
            config.instantiation.dockerBinaryPath,
            ['volume', 'rm', volumeName],
            {cwd: workingDirectory},
        );
    }

}
