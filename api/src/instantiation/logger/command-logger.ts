import {CommandLogInterface} from '../../persistence/interface/command-log.interface';
import {BaseLogger} from '../../logger/base-logger';

export class CommandLogger {

    constructor(
        private readonly commandLog: CommandLogInterface,
        private readonly logger: BaseLogger,
    ) {}

    emerg(message: string, meta: object = {}) {
        this.logger.emerg(message, this.getMeta());
    }

    alert(message: string, meta: object = {}) {
        this.logger.alert(message, this.getMeta());
    }

    crit(message: string, meta: object = {}) {
        this.logger.crit(message, this.getMeta());
    }

    error(message: string, meta: object = {}) {
        this.logger.error(message, this.getMeta());
    }

    warning(message: string, meta: object = {}) {
        this.logger.warning(message, this.getMeta());
    }

    notice(message: string, meta: object = {}) {
        this.logger.notice(message, this.getMeta());
    }

    info(message: string, meta: object = {}) {
        this.logger.info(message, this.getMeta());
    }

    debug(message: string, meta: object = {}) {
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
        return {commandLogId: this.commandLog.id.toString()};
    }

}