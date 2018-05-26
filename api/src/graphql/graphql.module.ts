import {Module} from '@nestjs/common';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {GraphqlController} from './graphql.controller';
import {GraphqlService} from './service/graphql.service';
import {typeDefsProvider} from './typeDefs.provider';
import {EnsureAuthenticatedMiddleware} from '../api/middleware/ensure-authenticated.middleware';
import {PersistenceModule} from '../persistence/persistence.module';
import {BundleDefinitionConfigMapper} from './service/bundle-definition-config-mapper.component';

@Module({
    imports: [
        PersistenceModule,
    ],
    controllers: [
        GraphqlController,
    ],
    components: [
        BundleDefinitionConfigMapper,
        GraphqlService,
        typeDefsProvider,
    ],
})
export class GraphqlModule {
    public configure(consumer: MiddlewaresConsumer) {
        consumer.apply(EnsureAuthenticatedMiddleware).forRoutes(GraphqlController);
    }
}
