import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { InstantiationModule } from '../instantiation/instantiation.module';
import { AssetController } from './controller/asset-controller';
import { DockerLogsController } from './controller/docker-logs-controller';
import { HelperModule } from '../helper/helper.module';
import { DefinitionRecipeMapper } from '../instantiation/definition-recipe-mapper.component';
import { ResolverPaginationArgumentsHelper } from './pagination-argument/resolver-pagination-arguments-helper.component';
import { ProjectsResolver } from './resolver/projects-resolver.component';
import { DefinitionResolver } from './resolver/definition-resolver.component';
import { InstanceResolver } from './resolver/Instance-resolver.component';
import { InstanceServiceResolver } from './resolver/instance-service-resolver.component';
import { CommandLogResolver } from './resolver/command-log-resolver.component';
import { AssetResolver } from './resolver/asset-resolver.component';
import { DeployKeyResolver } from './resolver/deploy-key-resolver.component';
import { ProjectLister } from './lister/project-lister.component';
import { DefinitionLister } from './lister/definition-lister.component';
import { InstanceLister } from './lister/instance-lister.component';
import { AssetLister } from './lister/asset-lister.component';
import { DeployKeyLister } from './lister/deploy-key-lister.component';
import { ProjectModelToTypeMapper } from './model-to-type-mapper/project-model-to-type-mapper.component';
import { DefinitionModelToTypeMapper } from './model-to-type-mapper/definition-model-to-type-mapper.component';
import { InstanceModelToTypeMapper } from './model-to-type-mapper/instance-model-to-type-mapper.component';
import { CommandLogModelToTypeMapper } from './model-to-type-mapper/command-log-model-to-type-mapper.component';
import { LogModelToTypeMapper } from './model-to-type-mapper/log-model-to-type-mapper.component';
import { AssetModelToTypeMapper } from './model-to-type-mapper/asset-model-to-type-mapper.component';
import { DeployKeyModelToTypeMapper } from './model-to-type-mapper/deploy-key-model-to-type-mapper.service';
import { DateConverter } from './date-converter.component';

@Module({
    imports: [PersistenceModule, InstantiationModule, HelperModule],
    controllers: [AssetController, DockerLogsController],
    providers: [
        ProjectsResolver,
        DefinitionResolver,
        InstanceResolver,
        InstanceServiceResolver,
        CommandLogResolver,
        AssetResolver,
        DeployKeyResolver,
        ProjectLister,
        DefinitionLister,
        InstanceLister,
        AssetLister,
        DeployKeyLister,
        ProjectModelToTypeMapper,
        DefinitionModelToTypeMapper,
        InstanceModelToTypeMapper,
        CommandLogModelToTypeMapper,
        LogModelToTypeMapper,
        AssetModelToTypeMapper,
        DeployKeyModelToTypeMapper,
        CommandLogModelToTypeMapper,
        DateConverter,
        ResolverPaginationArgumentsHelper,
    ],
})
export class ApiModule {}
