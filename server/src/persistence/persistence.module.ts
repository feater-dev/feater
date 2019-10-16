import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schema/project.schema';
import { DefinitionSchema } from './schema/definition.schema';
import { InstanceSchema } from './schema/instance.schema';
import { ProjectRepository } from './repository/project.repository';
import { DefinitionRepository } from './repository/definition.repository';
import { InstanceRepository } from './repository/instance.repository';
import { config } from '../config/config';
import { AssetSchema } from './schema/asset.schema';
import { AssetRepository } from './repository/asset.repository';
import { DeployKeySchema } from './schema/deploy-key.schema';
import { DeployKeyRepository } from './repository/deploy-key.repository';
import { CommandLogSchema } from './schema/command-log.schema';
import { CommandLogRepository } from './repository/command-log.repository';
import { AssetHelper } from './helper/asset-helper.component';
import { HelperModule } from '../helper/helper.module';

import * as mongoose from 'mongoose';
import { ActionLogSchema } from './schema/action-log.schema';
import { ActionLogRepository } from './repository/action-log.repository';
mongoose.set('useCreateIndex', true);

@Module({
    imports: [
        MongooseModule.forRoot(config.mongo.dsn, { useNewUrlParser: true }),
        MongooseModule.forFeature([
            {
                name: 'Project',
                schema: ProjectSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'Definition',
                schema: DefinitionSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'Instance',
                schema: InstanceSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'Asset',
                schema: AssetSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'DeployKey',
                schema: DeployKeySchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'ActionLog',
                schema: ActionLogSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'CommandLog',
                schema: CommandLogSchema,
            },
        ]),
        HelperModule,
    ],
    controllers: [],
    providers: [
        ProjectRepository,
        DefinitionRepository,
        InstanceRepository,
        AssetRepository,
        DeployKeyRepository,
        ActionLogRepository,
        CommandLogRepository,
        AssetHelper,
    ],
    exports: [
        ProjectRepository,
        DefinitionRepository,
        InstanceRepository,
        AssetRepository,
        DeployKeyRepository,
        ActionLogRepository,
        CommandLogRepository,
        AssetHelper,
    ],
})
export class PersistenceModule {}
