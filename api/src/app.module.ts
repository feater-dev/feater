import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { PersistenceModule } from './persistence/persistence.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { PassportInitializeMiddleware } from './authorization/signin-strategy/google-oauth2/middleware/passport-initialize.middleware';
import { PassportSessionMiddleware } from './authorization/signin-strategy/google-oauth2/middleware/passport-session.middleware';

@Module({
  imports: [
      PersistenceModule,
      AuthorizationModule,
      ApiModule,
  ],
  controllers: [],
  components: [],
})
export class ApplicationModule {}
