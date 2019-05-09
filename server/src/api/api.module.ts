import {Module} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {Validator} from './validation/validator.component';
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
  providers: [
      Validator,
  ],
})
export class ApiModule { }
