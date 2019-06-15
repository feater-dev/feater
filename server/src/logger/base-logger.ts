import * as winston from 'winston';
import 'winston-mongodb';
import {Injectable} from '@nestjs/common';
import {LoggerInterface} from './logger-interface';
import {config} from '../config/config';

@Injectable()
export class BaseLogger implements LoggerInterface {

    private readonly logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            exitOnError: false,
            transports: [
                new winston.transports.Console({
                    level: config.logger.console.logLevel,
                }),
                // @ts-ignore Was giving "Property 'MongoDB' does not exist on type 'Transports'."
                new winston.transports.MongoDB({
                    level: config.logger.mongoDb.logLevel,
                    db: config.mongo.dsn,
                    collection: 'logs',
                    tryReconnect: true,
                    decolorize: true,
                    metaKey: 'meta',
                }),
            ],
        });
    }

    emerg(message: string, meta: object = {}) {
        this.logger.emerg(message, {meta});
    }

    alert(message: string, meta: object = {}) {
        this.logger.alert(message, {meta});
    }

    crit(message: string, meta: object = {}) {
        this.logger.crit(message, {meta});
    }

    error(message: string, meta: object = {}) {
        this.logger.error(message, {meta});
    }

    warning(message: string, meta: object = {}) {
        this.logger.warning(message, {meta});
    }

    notice(message: string, meta: object = {}) {
        this.logger.notice(message, {meta});
    }

    info(message: string, meta: object = {}) {
        this.logger.log({level: 'info', message, meta});
    }

    debug(message: string, meta: object = {}) {
        this.logger.debug(message, {meta});
    }

}
