import {Injectable} from '@nestjs/common';
import * as split from 'split';
import {LoggerInterface} from '../logger/logger-interface';

@Injectable()
export class SpawnHelper {
    handleSpawned(
        spawned,
        logger: LoggerInterface,
        resolve: (payload?: any) => void,
        reject: (error?: any) => void,
        exitHandler: (exitCode: number) => void,
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

        const handleExit = exitCode => {
            if (0 !== exitCode) {
                exitHandler(exitCode);
                reject(exitCode);

                return;
            }

            resolve();
        };

        spawned.on('exit', handleExit);
        spawned.on('close', handleExit);
    }
}
