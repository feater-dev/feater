import * as winston from 'winston';
import * as elasticsearch from 'elasticsearch';
import * as winstonElasticsearchTransport from 'winston-elasticsearch';
import {Component} from '@nestjs/common';
import {LoggerInterface} from './logger-interface';
import {environment} from '../environment/environment';

@Component()
export class BaseLogger implements LoggerInterface {

    private readonly logger: winston.Logger;

    constructor() {

        this.logger = new winston.Logger({
            exitOnError: false,
            transports: [
                new winston.transports.Console({
                    level: environment.logger.consoleLogLevel,
                    timestamp: () => {
                        return (new Date()).toISOString();
                    },
                }),
                new winstonElasticsearchTransport({
                    level: 'debug',
                    indexPrefix: 'feat-logs',
                    client: new elasticsearch.Client({
                        host: environment.logger.elasticsearchHost,
                        log: environment.logger.elasticsearchLogLevel,
                    }),
                }),
            ],
        });

    }

    emerg(message: string, meta: object = {}) {
        this.logger.emerg(message, meta);
    }

    alert(message: string, meta: object = {}) {
        this.logger.alert(message, meta);
    }

    crit(message: string, meta: object = {}) {
        this.logger.crit(message, meta);
    }

    error(message: string, meta: object = {}) {
        this.logger.error(message, meta);
    }

    warning(message: string, meta: object = {}) {
        this.logger.warning(message, meta);
    }

    notice(message: string, meta: object = {}) {
        this.logger.notice(message, meta);
    }

    info(message: string, meta: object = {}) {
        this.logger.info(message, meta);
    }

    debug(message: string, meta: object = {}) {
        this.logger.debug    (message, meta);
    }

}
