import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schema/project.schema';
import { BuildDefinitionSchema } from './schema/build-definition.schema';
import { BuildInstanceSchema } from './schema/build-instance.schema';
import { ProjectRepository } from './project.repository';
import { BuildDefinitionRepository } from './build-definition.repository';
import { BuildInstanceRepository } from './build-instance.repository';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://mongo:27017/feat'), // TODO Move to config
      MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
      MongooseModule.forFeature([{ name: 'BuildInstance', schema: BuildInstanceSchema }]),
      MongooseModule.forFeature([{ name: 'BuildDefinition', schema: BuildDefinitionSchema }]),
  ],
  controllers: [],
  components: [
      ProjectRepository,
      BuildDefinitionRepository,
      BuildInstanceRepository,
  ],
  exports: [
      ProjectRepository,
      BuildDefinitionRepository,
      BuildInstanceRepository,
  ],
})
export class PersistenceModule {}
