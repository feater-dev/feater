import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ApiTokenSchema} from './schema/api-token.schema';
import {UserSchema} from './schema/user.schema';
import {ProjectSchema} from './schema/project.schema';
import {DefinitionSchema} from './schema/definition.schema';
import {InstanceSchema} from './schema/instance.schema';
import {UserRepository} from './repository/user.repository';
import {ProjectRepository} from './repository/project.repository';
import {DefinitionRepository} from './repository/definition.repository';
import {InstanceRepository} from './repository/instance.repository';
import {ApiTokenRepository} from './repository/api-token.repository';
import {environment} from '../environment/environment';

@Module({
  imports: [
      MongooseModule.forRoot(environment.mongo.dsn), // TODO Use config component instead with dynamic module (but how?)
      MongooseModule.forFeature([{ name: 'ApiToken', schema: ApiTokenSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
      MongooseModule.forFeature([{ name: 'Definition', schema: DefinitionSchema }]),
      MongooseModule.forFeature([{ name: 'Instance', schema: InstanceSchema }]),
  ],
  controllers: [],
  components: [
      ApiTokenRepository,
      UserRepository,
      ProjectRepository,
      DefinitionRepository,
      InstanceRepository,
  ],
  exports: [
      ApiTokenRepository,
      UserRepository,
      ProjectRepository,
      DefinitionRepository,
      InstanceRepository,
  ],
})
export class PersistenceModule {}
