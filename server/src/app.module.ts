import {Module} from '@nestjs/common';
import {ApiModule} from './api/api.module';
import {PersistenceModule} from './persistence/persistence.module';
import {HelperModule} from './helper/helper.module';
import {GraphQLModule} from '@nestjs/graphql';
import {GraphqlModule} from './graphql/graphql.module';

@Module({
  imports: [
      HelperModule,
      PersistenceModule,
      ApiModule,
      GraphQLModule.forRoot({
          typePaths: ['./src/graphql/schema/*.graphql'],
          path: '/api',
          debug: false,
          playground: false,
      }),
      GraphqlModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
