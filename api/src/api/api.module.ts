import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {UserController} from './controller/user.controller';
import {ProjectController} from './controller/project.controller';
import {DefinitionController} from './controller/definition.controller';
import {InstanceController} from './controller/instance.controller';
import {Validator} from './validation/validator.component';
import {EnsureAuthenticatedMiddleware} from './middleware/ensure-authenticated.middleware';

@Module({
  imports: [
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
      UserController,
      ProjectController,
      DefinitionController,
      InstanceController,
  ],
  components: [
      Validator,
      EnsureAuthenticatedMiddleware,
  ],
})
export class ApiModule implements NestModule {

    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(EnsureAuthenticatedMiddleware).forRoutes({
            path: '/api/*', method: RequestMethod.ALL,
        });
    }

}
