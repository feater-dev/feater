import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {ApiModule} from './api/api.module';
import {PersistenceModule} from './persistence/persistence.module';
import {HelperModule} from './helper/helper.module';

@Module({
  imports: [
      HelperModule,
      PersistenceModule,
      ApiModule,
      GraphQLModule.forRoot({
          typePaths: ['./src/api/schema/*.graphql'],
          path: '/api',
          debug: false,
          playground: false,
      }),
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
