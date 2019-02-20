import {Module} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {Validator} from './validation/validator.component';
import {AssetController} from './controller/asset-controller';

@Module({
  imports: [
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
      AssetController,
  ],
  providers: [
      Validator,
  ],
})
export class ApiModule { }
