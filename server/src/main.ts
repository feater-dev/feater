import * as morgan from 'morgan';
import * as process from 'process';
import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import {INestApplication} from '@nestjs/common';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(ApplicationModule);

    app.use(morgan('dev', {
        skip: (req, res) => {
            return res.statusCode < 400;
        },
        stream: process.stderr,
    }));

    app.use(morgan('dev', {
        skip: (req, res) => {
            return res.statusCode >= 400;
        },
        stream: process.stdout,
    }));

    // TODO Get port from config.
    await app.listen(3000);
}

bootstrap();
