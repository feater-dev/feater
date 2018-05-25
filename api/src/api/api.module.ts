import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { InstantiationModule } from '../instantiation/instantiation.module';
import { UserController } from './controller/user.controller';
import { ProjectController } from './controller/project.controller';
import { BuildDefinitionController } from './controller/build-definition.controller';
import { BuildInstanceController } from './controller/build-instance.controller';
import { Validator } from './validation/validator.component';
import { EnsureAuthenticatedMiddleware } from './middleware/ensure-authenticated.middleware';

@Module({
  imports: [
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
      UserController,
      ProjectController,
      BuildDefinitionController,
      BuildInstanceController,
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
