import {Component} from '@nestjs/common';
import {LogInterface, BuildJobLogInterface, SourceJobLogInterface} from '../interface/log.interface';
import {Client} from 'elasticsearch';
import {Config} from '../../config/config.component';

@Component()
export class LogRepository {

    private readonly client: Client;
    constructor(
        readonly config: Config,
    ) {
        this.client = new Client({
            host: config.logger.elasticsearchHost,
            log: config.logger.elasticsearchLogLevel,
        });
    }

    async findByInstanceId(instanceId: string): Promise<LogInterface[]> {
        const response = await this.client.search({
            index: 'feat-logs-*',
            body: {
                size: 9999,
                query: {
                    term: {
                        'fields.build.id': {
                            value: instanceId,
                        },
                    },
                },
                sort: [
                    {
                        '@timestamp': {
                            order: 'asc',
                        },
                    },
                ],
            },
        });

        const logs: LogInterface[] = [];
        for (const hit of response.hits.hits) {
            logs.push({
                timestamp: hit._source['@timestamp'],
                message: hit._source.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''),
            } as LogInterface);
        }

        return logs;
    }
}
