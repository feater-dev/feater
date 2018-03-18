import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);

    // TODO Use middleware for CORS.
	app.use(cors());

    // TODO Get port from config.
	await app.listen(3000);
}

bootstrap();
