import {Module} from '@nestjs/common';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {GraphqlController} from './graphql.controller';
import {GraphqlService} from './component/graphql.service';
import {typeDefsProvider} from './typeDefs.provider';
import {EnsureAuthenticatedMiddleware} from '../api/middleware/ensure-authenticated.middleware';
import {PersistenceModule} from '../persistence/persistence.module';
import {BuildDefinitionConfigMapper} from './component/build-definition-config-mapper.component';
import {ProjectsResolverFactory} from './component/projects-resolver-factory.component';
import {BuildDefinitionResolverFactory} from './component/build-definition-resolver-factory.component';
import {BuildInstanceResolverFactory} from './component/build-instance-resolver-factory.component';
import {UsersResolverFactory} from './component/users-resolver-factory.component';

@Module({
    imports: [
        PersistenceModule,
    ],
    controllers: [
        GraphqlController,
    ],
    components: [
        BuildDefinitionConfigMapper,
        GraphqlService,
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
