import { CommandLogInterface } from '../../persistence/interface/command-log.interface';
import { EnvVariablesSet } from '../sets/env-variables-set';
import { FeaterVariablesSet } from '../sets/feater-variables-set';
import { config } from '../../config/config';
import * as winston from 'winston';

export class CommandLogger {
    private readonly logger: winston.Logger;

    constructor(
        private readonly commandLog: CommandLogInterface,
        absoluteGuestCommandLogPath: string,
    ) {
        this.logger = winston.createLogger({
            exitOnError: false,
            transports: [
                new winston.transports.File({
                    level: config.logger.mongoDb.logLevel,
                    filename: absoluteGuestCommandLogPath,
                }),
            ],
        });
    }

    emerg(message: string, meta: unknown = {}): void {
        this.logger.emerg(message, meta);
    }

    alert(message: string, meta: unknown = {}): void {
        this.logger.alert(message, meta);
    }

    crit(message: string, meta: unknown = {}): void {
        this.logger.crit(message, meta);
    }

    error(message: string, meta: unknown = {}): void {
        this.logger.error(message, meta);
    }

    warning(message: string, meta: unknown = {}): void {
        this.logger.warning(message, meta);
    }

    notice(message: string, meta: unknown = {}): void {
        this.logger.notice(message, meta);
    }

    info(message: string, meta: unknown = {}): void {
        this.logger.info(message, meta);
    }

    infoWithJsonData(data: unknown, header: string, meta: unknown = {}): void {
        this.info(`${header}:\n${JSON.stringify(data, null, 2)}`, meta);
    }

    infoWithEnvVariables(
        envVariables: EnvVariablesSet,
        header: string = 'Added environmental variables',
        meta: unknown = {},
    ): void {
        if (envVariables.isEmpty()) {
            this.info(`${header}: none`, meta);

            return;
        }
        this.infoWithJsonData(envVariables.toMap(), header, meta);
    }

    infoWithFeaterVariables(
        featerVariables: FeaterVariablesSet,
        header: string = 'Added Feater variables',
        meta: unknown = {},
    ): void {
        if (featerVariables.isEmpty()) {
            this.info(`${header}: none`, meta);

            return;
        }
        this.infoWithJsonData(featerVariables.toMap(), header, meta);
    }

    debug(message: string, meta: unknown = {}): void {
        this.logger.debug(message, meta);
    }

    async markAsCompleted(): Promise<void> {
        this.commandLog.completedAt = new Date();
        await this.commandLog.save();
    }

    async markAsFailed(): Promise<void> {
        this.commandLog.failedAt = new Date();
        await this.commandLog.save();
    }
}
