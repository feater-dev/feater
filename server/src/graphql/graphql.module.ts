import {MiddlewareConsumer, Module} from '@nestjs/common';
import {GraphqlController} from './graphql.controller';
import {GraphqlSchemaFactory} from './schema/graphql-schema-factory.component';
import {typeDefsProvider} from './schema/typeDefs.provider';
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
import {HelperModule} from "../helper/helper.module";

@Module({
    imports: [
        HelperModule,
        PersistenceModule,
        InstantiationModule,
    ],
    controllers: [
        GraphqlController,
    ],
    providers: [
        DefinitionConfigMapper,
        GraphqlSchemaFactory,
        CommandLogsResolverFactory,
        CommandLogEntriesResolverFactory,
        ProjectsResolverFactory,
        DefinitionResolverFactory,
        InstanceResolverFactory,
        AssetResolverFactory,
        DeployKeyResolverFactory,
        DateResolverFactory,
        DockerDaemonResolverFactory,
        ResolverPaginationArgumentsHelper,
        typeDefsProvider,
    ],
})
export class GraphqlModule {}
