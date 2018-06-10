import {Module} from '@nestjs/common';
import {ConfigModule} from '../config/config.module';
import {LoggerModule} from '../logger/logger.module';
import {PersistenceModule} from '../persistence/persistence.module';
import {RunDockerComposeJobExecutor} from './job/run-docker-compose.job';
import {ResolveReferenceJobExecutor} from './job/resolve-reference.job';
import {ConnectContainersToNetworkJobExecutor} from './job/connect-containers-to-network-job';
import {CopyBeforeBuildTaskJobExecutor} from './job/copy-before-build-task.job';
import {CreateDirectoryJobExecutor} from './job/create-directory.job';
import {DownloadSourceJobExecutor} from './job/download-source.job';
import {ExtractSourceJobExecutor} from './job/extract-source.job';
import {GetContainerIdsJobExecutor} from './job/get-container-ids.job';
import {InterpolateBeforeBuildTaskJobExecutor} from './job/interpolate-before-build-task.job';
import {ParseDockerComposeJobExecutor} from './job/parse-docker-compose.job';
import {PrepareEnvVariablesJobExecutor} from './job/prepare-env-variables.job';
import {PreparePortDomainsJobExecutor} from './job/prepare-port-domains.job';
import {PrepareSummaryItemsJobExecutor} from './job/prepare-summary-items.job';
import {ProxyPortDomainsJobExecutor} from './job/proxy-port-domains.job';
import {GithubClient} from './github-client.component';
import {Instantiator} from './instantiator.component';
import {InterpolationHelper} from './interpolation-helper.component';
import {JobExecutorsCollection} from './job-executors-collection.component';
import {StagesListFactory} from './stages-list-factory.component';

@Module({
  imports: [
      ConfigModule,
      LoggerModule,
      PersistenceModule,
  ],
  controllers: [],
  components: [
      ConnectContainersToNetworkJobExecutor,
      CopyBeforeBuildTaskJobExecutor,
      CreateDirectoryJobExecutor,
      DownloadSourceJobExecutor,
      ExtractSourceJobExecutor,
      GetContainerIdsJobExecutor,
      InterpolateBeforeBuildTaskJobExecutor,
      ParseDockerComposeJobExecutor,
      PrepareEnvVariablesJobExecutor,
      PreparePortDomainsJobExecutor,
      PrepareSummaryItemsJobExecutor,
      ProxyPortDomainsJobExecutor,
      ResolveReferenceJobExecutor,
      RunDockerComposeJobExecutor,
      GithubClient,
      Instantiator,
      InterpolationHelper,
      JobExecutorsCollection,
      StagesListFactory,
  ],
  exports: [
      Instantiator,
  ],
})
export class InstantiationModule {}
