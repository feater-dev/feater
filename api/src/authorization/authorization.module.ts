import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {LoggerModule} from '../logger/logger.module';
import {PersistenceModule} from '../persistence/persistence.module';
import {SigninController} from './base/controller/signin.controller';
import {GoogleSigninController} from './signin-strategy/google-oauth2/controller/google-signin.controller';
import {GithubSigninController} from './signin-strategy/github-oauth2/controller/github-signin.controller';
import {PassportInitializeMiddleware} from './base/middleware/passport-initialize.middleware';
import {GooglePassportStrategyConfigurationComponent} from './signin-strategy/google-oauth2/component/google-passport-strategy-configurator.component';
import {GithubPassportStrategyConfigurationComponent} from './signin-strategy/github-oauth2/component/github-passport-strategy-configurator.component';
import {PassportUserSerializationConfigurationComponent} from './base/component/passport-user-serialization-configurator.component';
import {CustomBearerPassportStrategyConfiguratorComponent} from './api-strategy/custom-bearer/component/custom-bearer-passport-strategy-configurator.component';
import {CustomBearerAuthenticationMiddleware} from './api-strategy/custom-bearer/middleware/custom-bearer-authentication.middleware';
import {SpaRedirectorComponent} from './base/component/spa-redirector.component';

export const apiTokenHeader = 'x-feat-api-token';

@Module({
  imports: [
      LoggerModule,
      PersistenceModule,
  ],
  controllers: [
      SigninController,
      GoogleSigninController,
      GithubSigninController,
  ],
  components: [
      PassportInitializeMiddleware,
      PassportUserSerializationConfigurationComponent,
      GooglePassportStrategyConfigurationComponent,
      GithubPassportStrategyConfigurationComponent,
      CustomBearerPassportStrategyConfiguratorComponent,
      CustomBearerAuthenticationMiddleware,
      SpaRedirectorComponent,
  ],
})
export class AuthorizationModule implements NestModule {

    constructor(
        private readonly googlePassportStrategyConfigurationComponent: GooglePassportStrategyConfigurationComponent,
        private readonly githubPassportStrategyConfigurationComponent: GithubPassportStrategyConfigurationComponent,
        private readonly passportUserSerializationConfiguratorComponent: PassportUserSerializationConfigurationComponent,
        private readonly customBearerPassportStrategyConfiguratorComponent: CustomBearerPassportStrategyConfiguratorComponent,
    ) {}

    configure(consumer: MiddlewaresConsumer): void {

        consumer.apply(PassportInitializeMiddleware).forRoutes({
            path: '*', method: RequestMethod.ALL,
        });

        //consumer.apply(CustomBearerAuthenticationMiddleware).forRoutes({
        //    path: '/api/*', method: RequestMethod.ALL,
        //});

        this.googlePassportStrategyConfigurationComponent.configure();
        this.githubPassportStrategyConfigurationComponent.configure();
        this.passportUserSerializationConfiguratorComponent.configure();
        //this.customBearerPassportStrategyConfiguratorComponent.configure();

    }

}
