import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiTokenSchema } from './schema/api-token.schema';
import { UserSchema } from './schema/user.schema';
import { ProjectSchema } from './schema/project.schema';
import { BuildDefinitionSchema } from './schema/build-definition.schema';
import { BuildInstanceSchema } from './schema/build-instance.schema';
import { UserRepository } from './repository/user.repository';
import { ProjectRepository } from './repository/project.repository';
import { BuildDefinitionRepository } from './repository/build-definition.repository';
import { BuildInstanceRepository } from './repository/build-instance.repository';
import {ApiTokenRepository} from './repository/api-token.repository';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://mongo:27017/feat'), // TODO Move to config
      MongooseModule.forFeature([{ name: 'ApiToken', schema: ApiTokenSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
      MongooseModule.forFeature([{ name: 'BuildInstance', schema: BuildInstanceSchema }]),
      MongooseModule.forFeature([{ name: 'BuildDefinition', schema: BuildDefinitionSchema }]),
  ],
  controllers: [],
  components: [
      ApiTokenRepository,
      UserRepository,
      ProjectRepository,
      BuildDefinitionRepository,
      BuildInstanceRepository,
  ],
  exports: [
      ApiTokenRepository,
      UserRepository,
      ProjectRepository,
      BuildDefinitionRepository,
      BuildInstanceRepository,
  ],
})
export class PersistenceModule {}
