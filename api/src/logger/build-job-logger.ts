import * as _ from 'lodash';
import { LoggerInterface } from './logger-interface';
import { BaseLogger } from './base-logger';
import { BuildJobInterface } from '../instantiation/job/job';

export class BuildJobLogger implements LoggerInterface {

    constructor(
        private readonly baseLogger: BaseLogger,
        private readonly buildJob: BuildJobInterface,
    ) {}

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

    private getExtendedMeta(meta: object): object {
        return _.extend(
            {},
            _.isEmpty(meta)
                ? {}
                : { [this.buildJob.constructor.name]: meta }
            ,
            {
                job: this.buildJob.constructor.name,
                build: {
                    id: this.buildJob.build.id,
                    hash: this.buildJob.build.hash,
                },
            },
        );
    }

}
