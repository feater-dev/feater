import * as fs from 'fs-extra';
import * as path from 'path';
import * as mkdirRecursive from 'mkdir-recursive';
import * as Busboy from 'busboy';

import {
    Controller,
    Post,
    Request,
    Response,
    Next,
    Param,
} from '@nestjs/common';
import { AssetRepository } from '../../persistence/repository/asset.repository';
import { AssetHelper } from '../../persistence/helper/asset-helper.component';

@Controller()
export class AssetController {
    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly assetHelper: AssetHelper,
    ) {}

    @Post('upload/asset/:projectId/:id')
    public async create(
        @Request() req,
        @Response() res,
        @Next() next,
        @Param('projectId') projectId,
        @Param('id') id,
    ): Promise<void> {
        let assetFilePromise;

        const assets = await this.assetRepository.find(
            {
                id,
                projectId,
            },
            0,
            1,
        );

        if (1 !== assets.length) {
            res.status(404).send();

            throw new Error('Asset not found.');
        }

        const asset = assets[0];

        if (asset.uploaded) {
            throw new Error('Asset already exists.');
        }

        const busboy = new Busboy({ headers: req.headers });

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            if ('asset' !== fieldname) {
                return;
            }

            assetFilePromise = new Promise((resolve, reject) => {
                const uploadPaths = this.assetHelper.getUploadPaths(asset);

                mkdirRecursive.mkdirSync(path.dirname(uploadPaths.absolute));

                const writeStream = fs.createWriteStream(uploadPaths.absolute);
                file.pipe(writeStream);

                writeStream.on('close', () => {
                    resolve();
                });
            });
        });

        busboy.on('finish', async () => {
            if (!assetFilePromise) {
                res.status(500).send();

                return;
            }

            await assetFilePromise;
            await this.assetRepository.markAsUploaded(asset._id);

            res.status(200).send();
        });

        req.pipe(busboy);
    }
}
