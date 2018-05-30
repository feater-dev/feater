import {Module} from '@nestjs/common';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {GraphqlController} from './graphql.controller';
import {GraphqlSchemaFactory} from './schema/graphql-schema-factory.component';
import {typeDefsProvider} from './schema/typeDefs.provider';
import {EnsureAuthenticatedMiddleware} from '../api/middleware/ensure-authenticated.middleware';
import {PersistenceModule} from '../persistence/persistence.module';
import {BuildDefinitionConfigMapper} from './resolver/build-definition-config-mapper.component';
import {ProjectsResolverFactory} from './resolver/projects-resolver-factory.component';
import {BuildDefinitionResolverFactory} from './resolver/build-definition-resolver-factory.component';
import {BuildInstanceResolverFactory} from './resolver/build-instance-resolver-factory.component';
import {UsersResolverFactory} from './resolver/users-resolver-factory.component';
import {InstantiationModule} from '../instantiation/instantiation.module';

@Module({
    imports: [
        PersistenceModule,
        InstantiationModule,
    ],
    controllers: [
        GraphqlController,
    ],
    components: [
        BuildDefinitionConfigMapper,
        GraphqlSchemaFactory,
        UsersResolverFactory,
        ProjectsResolverFactory,
        BuildDefinitionResolverFactory,
        BuildInstanceResolverFactory,
        typeDefsProvider,
    ],
})
export class GraphqlModule {
    public configure(consumer: MiddlewaresConsumer) {
        consumer.apply(EnsureAuthenticatedMiddleware).forRoutes(GraphqlController);
    }
}
