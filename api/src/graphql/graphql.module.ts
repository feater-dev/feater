import {Module} from '@nestjs/common';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {GraphqlController} from './graphql.controller';
import {GraphqlService} from './graphql.service';
import {typeDefsProvider} from './typeDefs.provider';
import {EnsureAuthenticatedMiddleware} from '../api/middleware/ensure-authenticated.middleware';
import {ApiModule} from '../api/api.module';
import {PersistenceModule} from '../persistence/persistence.module';

@Module({
    imports: [
        PersistenceModule,
        ApiModule,
    ],
    controllers: [
        GraphqlController,
    ],
    components: [
        GraphqlService,
        typeDefsProvider,
    ],
})
export class GraphqlModule {
    public configure(consumer: MiddlewaresConsumer) {
        consumer.apply(EnsureAuthenticatedMiddleware).forRoutes(GraphqlController);
    }
}
