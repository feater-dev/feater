import {Module} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {Validator} from './validation/validator.component';
import {EnsureAuthenticatedMiddleware} from './middleware/ensure-authenticated.middleware';
import {AssetController} from './controller/asset-controller';
import {ConfigModule} from '../config/config.module';

@Module({
  imports: [
      ConfigModule,
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
      AssetController,
  ],
  components: [
      Validator,
      EnsureAuthenticatedMiddleware,
  ],
})
export class ApiModule { }
