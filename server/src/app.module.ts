import {Module} from '@nestjs/common';
import {ApiModule} from './api/api.module';
import {PersistenceModule} from './persistence/persistence.module';
import {GraphqlModule} from './graphql/graphql.module';
import {HelperModule} from "./helper/helper.module";

@Module({
  imports: [
      HelperModule,
      PersistenceModule,
      ApiModule,
      GraphqlModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
