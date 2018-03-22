import * as cors from 'cors';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);

    app.use(cors());

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
