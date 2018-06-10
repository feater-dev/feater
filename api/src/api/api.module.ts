import {Module} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {Validator} from './validation/validator.component';
import {EnsureAuthenticatedMiddleware} from './middleware/ensure-authenticated.middleware';

@Module({
  imports: [
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
  ],
  components: [
      Validator,
      EnsureAuthenticatedMiddleware,
  ],
})
export class ApiModule {}
