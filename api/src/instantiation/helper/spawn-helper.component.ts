import {Injectable} from '@nestjs/common';
import * as split from 'split';
import {LoggerInterface} from '../../logger/logger-interface';
import {ExecuteCommandError} from './execute-command-error';

@Injectable()
export class SpawnHelper {
    handleSpawned(
        spawned,
        logger: LoggerInterface,
        resolve: (payload?: any) => void,
        reject: (error?: any) => void,
        successfulExitHandler: () => void,
        failedExitHandler: (exitCode: number) => void,
        errorHandler: (error: Error) => void,
    ): void {
        spawned.stdout
            .pipe(split())
            .on('data', (line: string) => { logger.info(line, {}); });

        spawned.stderr
            .pipe(split())
            .on('data', (line: string) => { logger.error(line.toString(), {}); });

        spawned.on('error', error => {
            errorHandler(error);
            reject(error);
        });

        spawned.on('exit', exitCode => {
            if (0 !== exitCode) {
                failedExitHandler(exitCode);
                reject(new ExecuteCommandError(exitCode));

                return;
            }

            successfulExitHandler();
            resolve();
        });
    }
}
