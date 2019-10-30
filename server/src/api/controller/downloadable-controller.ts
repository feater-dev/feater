import { Controller, Response, Next, Param, Get } from '@nestjs/common';
import { InstanceRepository } from '../../persistence/repository/instance.repository';
import { spawn } from 'child_process';
import * as contentDisposition from 'content-disposition';
import * as moment from 'moment';
import {
    InstanceDownloadableInterface,
    InstanceInterface,
    InstanceServiceInterface,
} from '../../persistence/interface/instance.interface';
import { config } from '../../config/config';

@Controller()
export class DownloadableController {
    constructor(private readonly instanceRepository: InstanceRepository) {}

    @Get('download/downloadable/:instanceId/:downloadableId')
    public async download(
        @Response() res,
        @Next() next,
        @Param('instanceId') instanceId,
        @Param('downloadableId') downloadableId,
    ): Promise<void> {
        const instance = await this.instanceRepository.findById(instanceId);
        if (!instance) {
            return this.respondWithNotFound(res);
        }

        const downloadable = this.findDownloadable(downloadableId, instance);
        if (!downloadable) {
            return this.respondWithNotFound(res);
        }

        const service = this.findService(downloadable.serviceId, instance);
        if (!service) {
            return this.respondWithNotFound(res);
        }

        const spawnedDockerCopy = spawn(config.instantiation.dockerBinaryPath, [
            'cp',
            '-a',
            `${service.containerId}:${downloadable.absolutePath}`,
            '-',
        ]);

        res.status(200).set({
            'Content-Type': 'application/x-tar',
            'Content-Disposition': contentDisposition(
                `downloadable-${instance.hash}-${
                    downloadable.id
                }-${moment().format('YmdHis')}.tar`,
            ),
        });

        spawnedDockerCopy.stdout.pipe(res);

        // TODO Handle error differently.
        spawnedDockerCopy.stderr.pipe(res);
    }

    protected respondWithNotFound(res) {
        res.status(404).send();
    }

    protected findDownloadable(
        downloadableId: string,
        instance: InstanceInterface,
    ): InstanceDownloadableInterface | null {
        for (const downloadable of instance.downloadables) {
            if (downloadable.id === downloadableId) {
                return downloadable;
            }
        }

        return null;
    }

    protected findService(
        serviceId: string,
        instance: InstanceInterface,
    ): InstanceServiceInterface | null {
        for (const service of instance.services) {
            if (service.id === serviceId) {
                return service;
            }
        }

        return null;
    }
}
