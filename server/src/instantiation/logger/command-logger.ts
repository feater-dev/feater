import { CommandLogInterface } from '../../persistence/interface/command-log.interface';
import { BaseLogger } from '../../logger/base-logger';
import { EnvVariablesSet } from '../sets/env-variables-set';
import { FeaterVariablesSet } from '../sets/feater-variables-set';

export class CommandLogger {
    constructor(
        private readonly commandLog: CommandLogInterface,
        private readonly logger: BaseLogger,
    ) {}

    emerg(message: string, meta: unknown = {}): void {
        this.logger.emerg(message, this.getMeta());
    }

    alert(message: string, meta: unknown = {}): void {
        this.logger.alert(message, this.getMeta());
    }

    crit(message: string, meta: unknown = {}): void {
        this.logger.crit(message, this.getMeta());
    }

    error(message: string, meta: unknown = {}): void {
        this.logger.error(message, this.getMeta());
    }

    warning(message: string, meta: unknown = {}): void {
        this.logger.warning(message, this.getMeta());
    }

    notice(message: string, meta: unknown = {}): void {
        this.logger.notice(message, this.getMeta());
    }

    info(message: string, meta: unknown = {}): void {
        this.logger.info(message, this.getMeta());
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
        this.logger.debug(message, this.getMeta());
    }

    markAsCompleted(): Promise<unknown> {
        this.commandLog.completedAt = new Date();

        return this.commandLog.save();
    }

    markAsFailed(): Promise<unknown> {
        this.commandLog.failedAt = new Date();

        return this.commandLog.save();
    }

    private getMeta(): unknown {
        return { commandLogId: this.commandLog.id.toString() };
    }
}
