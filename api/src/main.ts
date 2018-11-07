import * as cors from 'cors';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './app.module';
import {INestApplication} from '@nestjs/common';

async function bootstrap() {
    dotenv.config();

    const app: INestApplication = await NestFactory.create(ApplicationModule);

    app.use(cors({
        allowedHeaders: ['content-type'],
    }));

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

    await app.listen(process.env.PORT);
}

bootstrap();
