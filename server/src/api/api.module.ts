import {Module} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {AssetController} from './controller/asset-controller';
import {DockerLogsController} from './controller/docker-logs-controller';

@Module({
  imports: [
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
      AssetController,
      DockerLogsController,
  ],
})
export class ApiModule { }
