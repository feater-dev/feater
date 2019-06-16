import {Module} from '@nestjs/common';
import {PersistenceModule} from '../persistence/persistence.module';
import {DefinitionConfigMapper} from './resolver/definition-config-mapper.component';
import {ProjectsResolverFactory} from './resolver/projects-resolver-factory.component';
import {DefinitionResolverFactory} from './resolver/definition-resolver-factory.component';
import {InstanceResolverFactory} from './resolver/instance-resolver-factory.component';
import {InstantiationModule} from '../instantiation/instantiation.module';
import {ResolverPaginationArgumentsHelper} from './resolver/pagination-argument/resolver-pagination-arguments-helper.component';
import {DateResolverFactory} from './resolver/date-resolver-factory.component';
import {DockerDaemonResolverFactory} from './resolver/docker-daemon-resolver-factory.component';
import {AssetResolverFactory} from './resolver/asset-resolver-factory.component';
import {DeployKeyResolverFactory} from './resolver/deploy-key-resolver-factory.component';
import {CommandLogsResolverFactory} from './resolver/command-logs-resolver-factory.component';
import {CommandLogEntriesResolverFactory} from './resolver/command-log-entries-resolver-factory.component';
import {HelperModule} from '../helper/helper.module';
import {ProjectsResolver} from './resolver/projects-resolver.component';
import {ProjectLister} from './resolver/project-lister.component';
import {ProjectModelToTypeMapper} from './resolver/project-model-to-type-mapper.component';
import {DefinitionLister} from './resolver/definition-lister.component';
import {DefinitionModelToTypeMapper} from './resolver/definition-model-to-type-mapper.component';
import {AssetModelToTypeMapper} from './resolver/asset-model-to-type-mapper.component';
import {AssetLister} from './resolver/asset-lister.component';
import {DateConverter} from './resolver/date-resolver.component';

@Module({
    imports: [
        HelperModule,
        PersistenceModule,
        InstantiationModule,
    ],
    providers: [
        DefinitionConfigMapper,
        CommandLogsResolverFactory, // TODO Refactor and remove.
        CommandLogEntriesResolverFactory, // TODO Refactor and remove.
        ProjectsResolverFactory, // TODO Refactor and remove.
        DefinitionResolverFactory, // TODO Refactor and remove.
        InstanceResolverFactory, // TODO Refactor and remove.
        AssetResolverFactory, // TODO Refactor and remove.
        DeployKeyResolverFactory, // TODO Refactor and remove.
        DateResolverFactory, // TODO Refactor and remove.
        DockerDaemonResolverFactory, // TODO Refactor and remove.
        ResolverPaginationArgumentsHelper,
        // ---
        ProjectsResolver,
        ProjectLister,
        DefinitionLister,
        AssetLister,
        ProjectModelToTypeMapper,
        DefinitionModelToTypeMapper,
        AssetModelToTypeMapper,
        DateConverter,
    ],
})
export class GraphqlModule {}
