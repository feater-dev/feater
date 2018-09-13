import {Controller, Post, Request, Response, Next, Param} from '@nestjs/common';
import {Config} from '../../config/config.component';
import {AssetRepository} from '../../persistence/repository/asset.repository';
import * as nanoidGenerate from 'nanoid/generate';
import * as path from 'path';
import * as Busboy from 'busboy';
import * as fs from 'fs-extra';

@Controller()
export class AssetController {

    constructor(
        private readonly config: Config,
        private readonly assetRepository: AssetRepository,
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

        const assetFilename = nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 32);

        const busboy = new Busboy({ headers: req.headers });

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            if ('asset' !== fieldname) {
                return;
            }

            assetFilePromise = new Promise((resolve, reject) => {
                const writeStream = fs.createWriteStream(path.join(this.config.guestPaths.asset, assetFilename)); // TODO Add namespace for project

                file.pipe(writeStream);

                writeStream.on('close', () => {
                    resolve();
                });
            });
        });

        busboy.on('finish', () => {
            if (!assetFilePromise) {
                res.status(500).send();

                return;
            }

            assetFilePromise
                .then(() => {
                    return this.assetRepository.updateFilename(asset._id, assetFilename);
                })
                .then(() => {
                    res.status(200).send();
                });
        });

        req.pipe(busboy);
    }

}
