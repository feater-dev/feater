import * as fs from 'fs-extra';
import * as path from 'path';
import * as mkdirRecursive from 'mkdir-recursive';
import * as Busboy from 'busboy';

import {Controller, Post, Request, Response, Next, Param} from '@nestjs/common';
import {AssetRepository} from '../../persistence/repository/asset.repository';
import {AssetHelper} from '../../instantiation/asset-helper.component';

@Controller()
export class AssetController {

    constructor(
        private readonly assetRepository: AssetRepository,
        private readonly assetHelper: AssetHelper,
    ) {}

    @Post('asset/:id')
    public async create(@Request() req, @Response() res, @Next() next, @Param('id') id) {
        let assetFilePromise;

        const asset = await this.assetRepository
            .find({id}, 0, 1)
            .then(assets => {
                if (1 !== assets.length) {
                    res.status(404).send();

                    throw new Error('Asset not found.');
                }

                return assets[0];
            });

        const busboy = new Busboy({ headers: req.headers });

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            if ('asset' !== fieldname) {
                return;
            }


            assetFilePromise = new Promise((resolve, reject) => {
                const uploadPaths = this.assetHelper.getUploadPaths(asset);

                mkdirRecursive.mkdirSync(path.dirname(uploadPaths.absolute.guest));

                const writeStream = fs.createWriteStream(uploadPaths.absolute.guest);
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
