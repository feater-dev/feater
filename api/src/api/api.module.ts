import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { BuildDefinitionController } from './controller/build-definition.controller';
import { BuildInstanceController } from './controller/build-instance.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import { InstantiationModule } from '../instantiation/instantiation.module';
import { Validator } from './validation/validator.component';

@Module({
  imports: [
      PersistenceModule,
      InstantiationModule,
  ],
  controllers: [
      ProjectController,
      BuildDefinitionController,
      BuildInstanceController,
  ],
  components: [
      Validator,
  ],
})
export class ApiModule {}
