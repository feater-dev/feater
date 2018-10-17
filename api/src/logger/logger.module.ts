import {Module} from '@nestjs/common';
import {BaseLogger} from './base-logger';
import {CommandLoggerFactoryComponent} from './command-logger-factory.component';

@Module({
  imports: [],
  controllers: [],
  providers: [
      BaseLogger,
      CommandLoggerFactoryComponent,
  ],
  exports: [
      BaseLogger,
      CommandLoggerFactoryComponent,
  ],
})
export class LoggerModule {}
