import { Controller, Response, Param, Get, Next } from '@nestjs/common';
import { InstanceRepository } from '../../persistence/repository/instance.repository';
import { config } from '../../config/config';
import { spawn } from 'child_process';
import * as contentDisposition from 'content-disposition';
import * as moment from 'moment';

@Controller()
export class DockerLogsController {
    constructor(private readonly instanceRepository: InstanceRepository) {}

    @Get('download/docker-logs/:instanceId/:serviceId')
    public async download(
        @Response() res,
        @Next() next,
        @Param('instanceId') instanceId: string,
        @Param('serviceId') serviceId: string,
    ): Promise<void> {
        const instance = await this.instanceRepository.findById(instanceId);

        if (instance) {
            for (const service of instance.services) {
                if (service.id === serviceId) {
                    const spawnedDockerLog = spawn(
                        config.instantiation.dockerBinaryPath,
                        ['logs', service.containerId],
                    );

                    res.status(200).set({
                        'Content-Type': 'text/plain',
                        'Content-Disposition': contentDisposition(
                            `docker-logs-${
                                instance.hash
                            }-${serviceId}-${moment().format('YmdHis')}.log`,
                        ),
                    });

                    spawnedDockerLog.stdout.pipe(res);
                    spawnedDockerLog.stderr.pipe(res);

                    return;
                }
            }
        }

        res.status(404).send();
    }
}
