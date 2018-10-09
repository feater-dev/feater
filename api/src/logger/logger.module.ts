import {Module} from '@nestjs/common';
import {BaseLogger} from './base-logger';
import {JobLoggerFactory} from './job-logger-factory';

@Module({
  imports: [],
  controllers: [],
  providers: [
      BaseLogger,
      JobLoggerFactory,
  ],
  exports: [
      BaseLogger,
      JobLoggerFactory,
  ],
})
export class LoggerModule {}
