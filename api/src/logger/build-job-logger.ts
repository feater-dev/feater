import * as _ from 'lodash';
import {Build} from '../instantiation/build';
import {LoggerInterface} from './logger-interface';
import {BaseLogger} from './base-logger';

export class BuildJobLogger implements LoggerInterface {

    protected readonly baseLogger: BaseLogger;
    protected readonly build: Build;

    constructor(
        baseLogger: BaseLogger,
        build: Build,
    ) {
        this.baseLogger = baseLogger;
        this.build = build;
    }

    emerg(message: string, meta: object = {}) {
        this.baseLogger.emerg(message, this.getExtendedMeta(meta));
    }

    alert(message: string, meta: object = {}) {
        this.baseLogger.alert(message, this.getExtendedMeta(meta));
    }

    crit(message: string, meta: object = {}) {
        this.baseLogger.crit(message, this.getExtendedMeta(meta));
    }

    error(message: string, meta: object = {}) {
        this.baseLogger.error(message, this.getExtendedMeta(meta));
    }

    warning(message: string, meta: object = {}) {
        this.baseLogger.warning(message, this.getExtendedMeta(meta));
    }

    notice(message: string, meta: object = {}) {
        this.baseLogger.notice(message, this.getExtendedMeta(meta));
    }

    info(message: string, meta: object = {}) {
        this.baseLogger.info(message, this.getExtendedMeta(meta));
    }

    debug(message: string, meta: object = {}) {
        this.baseLogger.debug(message, this.getExtendedMeta(meta));
    }

    protected getExtendedMeta(meta: object): object {
        return _.extend(
            {},
            meta,
            {
                build: {
                    id: this.build.id,
                    hash: this.build.hash,
                },
            },
        );
    }

}
