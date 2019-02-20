import * as split from 'split';
import {Injectable} from '@nestjs/common';
import {ExecuteCommandError} from './execute-command-error';
import {CommandLogger} from "../logger/command-logger";

interface SpawnHelperOptions {
    muteStdout: boolean;
}

const defaultSpawnHelperOptions: SpawnHelperOptions = {
    muteStdout: false,
};

@Injectable()
export class SpawnHelper {

    handleSpawned(
        spawned,
        commandLogger: CommandLogger,
        resolve: (payload?: any) => void,
        reject: (error?: any) => void,
        successfulExitHandler: () => void,
        failedExitHandler: (exitCode: number) => void,
        errorHandler: (error: Error) => void,
        options: SpawnHelperOptions = defaultSpawnHelperOptions,
    ): void {
        if (!options.muteStdout) {
            spawned.stdout
                .pipe(split())
                .on('data', (line: string) => {
                    commandLogger.info(line);
                });
        }

        spawned.stderr
            .pipe(split())
            .on('data', (line: string) => { commandLogger.error(line.toString()); });

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

    promisifySpawned(
        spawned,
        commandLogger: CommandLogger,
        successfulExitHandler: () => void,
        failedExitHandler: (exitCode: number) => void,
        errorHandler: (error: Error) => void,
        options: SpawnHelperOptions = defaultSpawnHelperOptions,
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.handleSpawned(
                spawned,
                commandLogger,
                resolve,
                reject,
                successfulExitHandler,
                failedExitHandler,
                errorHandler,
                options,
            )
        })
    }

    promisifySpawnedWithHeader(
        spawned,
        commandLogger: CommandLogger,
        header: string,
        options: SpawnHelperOptions = defaultSpawnHelperOptions,
    ): Promise<void> {
        return this.promisifySpawned(
            spawned,
            commandLogger,
            () => {
                commandLogger.info(`Succeeded to ${header}.`);
            },
            (exitCode: number) => {
                commandLogger.error(`Failed to ${header}.`);
                commandLogger.error(`Exit code: ${exitCode}`);
            },
            (error: Error) => {
                commandLogger.error(`Failed to ${header}.`);
                commandLogger.error(`Error message: ${error.message}`);
            },
            options,
        );
    }


}
