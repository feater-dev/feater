import {Module} from '@nestjs/common';
import {BaseLogger} from './base-logger';

@Module({
  imports: [],
  controllers: [],
  providers: [
      BaseLogger,
  ],
  exports: [
      BaseLogger,
  ],
})
export class LoggerModule {}
