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
import {LogRepository} from './repository/log.repository';
import {AssetSchema} from './schema/asset.schema';
import {AssetRepository} from './repository/asset.repository';
import {DeployKeySchema} from './schema/deploy-key.schema';
import {DeployKeyRepository} from './repository/deploy-key.repository';
import {LogSchema} from './schema/log.schema';

@Module({
  imports: [
      MongooseModule.forRoot(environment.mongo.dsn),
      MongooseModule.forFeature([{ name: 'ApiToken', schema: ApiTokenSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
      MongooseModule.forFeature([{ name: 'Definition', schema: DefinitionSchema }]),
      MongooseModule.forFeature([{ name: 'Instance', schema: InstanceSchema }]),
      MongooseModule.forFeature([{ name: 'Asset', schema: AssetSchema }]),
      MongooseModule.forFeature([{ name: 'DeployKey', schema: DeployKeySchema }]),
      MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),
  ],
  controllers: [],
  providers: [
      ApiTokenRepository,
      UserRepository,
      ProjectRepository,
      DefinitionRepository,
      InstanceRepository,
      AssetRepository,
      DeployKeyRepository,
      LogRepository,
  ],
  exports: [
      ApiTokenRepository,
      UserRepository,
      ProjectRepository,
      DefinitionRepository,
      InstanceRepository,
      AssetRepository,
      DeployKeyRepository,
      LogRepository,
  ],
})
export class PersistenceModule {}
