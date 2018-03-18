import { Module } from '@nestjs/common';
import { Config } from './config.component';

@Module({
  imports: [],
  controllers: [],
  components: [Config],
  exports: [Config],
})
export class ConfigModule {}
