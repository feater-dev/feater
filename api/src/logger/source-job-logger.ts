import * as _ from 'lodash';
import {BaseLogger} from './base-logger';
import {SourceJobInterface} from '../instantiation/job/job';
import {LoggerInterface} from './logger-interface';

export class SourceJobLogger implements LoggerInterface {

    constructor(
        private readonly baseLogger: BaseLogger,
        private readonly sourceJob: SourceJobInterface,
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
                : { [this.sourceJob.constructor.name]: meta }
            ,
            {
                job: this.sourceJob.constructor.name,
                source: {
                    id: this.sourceJob.source.id,
                },
                build: {
                    id: this.sourceJob.source.build.id,
                    hash: this.sourceJob.source.build.hash,
                },
            },
        );
    }

}
