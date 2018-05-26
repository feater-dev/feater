import {Module} from '@nestjs/common';
import {ConfigModule} from '../config/config.module';
import {BaseLogger} from './base-logger';
import {JobLoggerFactory} from './job-logger-factory';

@Module({
  imports: [
      ConfigModule,
  ],
  controllers: [],
  components: [
      BaseLogger,
      JobLoggerFactory,
  ],
  exports: [
      BaseLogger,
      JobLoggerFactory,
  ],
})
export class LoggerModule {}
