import { CommandLogInterface } from '../../persistence/interface/command-log.interface';
import { BaseLogger } from '../../logger/base-logger';
import { EnvVariablesSet } from '../sets/env-variables-set';
import { FeaterVariablesSet } from '../sets/feater-variables-set';

export class CommandLogger {
    constructor(
        private readonly commandLog: CommandLogInterface,
        private readonly logger: BaseLogger,
    ) {}

    emerg(message: string, meta: any = {}): void {
        this.logger.emerg(message, this.getMeta());
    }

    alert(message: string, meta: any = {}): void {
        this.logger.alert(message, this.getMeta());
    }

    crit(message: string, meta: any = {}): void {
        this.logger.crit(message, this.getMeta());
    }

    error(message: string, meta: any = {}): void {
        this.logger.error(message, this.getMeta());
    }

    warning(message: string, meta: any = {}): void {
        this.logger.warning(message, this.getMeta());
    }

    notice(message: string, meta: any = {}): void {
        this.logger.notice(message, this.getMeta());
    }

    info(message: string, meta: any = {}): void {
        this.logger.info(message, this.getMeta());
    }

    infoWithJsonData(data: any, header: string, meta: any = {}): void {
        this.info(`${header}:\n${JSON.stringify(data, null, 2)}`, meta);
    }

    infoWithEnvVariables(
        envVariables: EnvVariablesSet,
        header: string = 'Added environmental variables',
        meta: any = {},
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
        meta: any = {},
    ): void {
        if (featerVariables.isEmpty()) {
            this.info(`${header}: none`, meta);

            return;
        }
        this.infoWithJsonData(featerVariables.toMap(), header, meta);
    }

    debug(message: string, meta: any = {}): void {
        this.logger.debug(message, this.getMeta());
    }

    markAsCompleted(): Promise<any> {
        this.commandLog.completedAt = new Date();

        return this.commandLog.save();
    }

    markAsFailed(): Promise<any> {
        this.commandLog.failedAt = new Date();

        return this.commandLog.save();
    }

    private getMeta(): any {
        return { commandLogId: this.commandLog.id.toString() };
    }
}
