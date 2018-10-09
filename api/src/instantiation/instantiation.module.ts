import {Module} from '@nestjs/common';
import {LoggerModule} from '../logger/logger.module';
import {PersistenceModule} from '../persistence/persistence.module';
import {RunDockerComposeJobExecutor} from './job/run-docker-compose.job';
import {ConnectContainersToNetworkJobExecutor} from './job/connect-containers-to-network-job';
import {CopyBeforeBuildTaskJobExecutor} from './job/copy-before-build-task.job';
import {CreateDirectoryJobExecutor} from './job/create-directory.job';
import {CloneSourceJobExecutor} from './job/clone-source.job';
import {GetContainerIdsJobExecutor} from './job/get-container-ids.job';
import {InterpolateBeforeBuildTaskJobExecutor} from './job/interpolate-before-build-task.job';
import {ParseDockerComposeJobExecutor} from './job/parse-docker-compose.job';
import {PrepareEnvVariablesJobExecutor} from './job/prepare-env-variables.job';
import {PreparePortDomainsJobExecutor} from './job/prepare-port-domains.job';
import {PrepareSummaryItemsJobExecutor} from './job/prepare-summary-items.job';
import {ProxyPortDomainsJobExecutor} from './job/proxy-port-domains.job';
import {Instantiator} from './instantiator.component';
import {InterpolationHelper} from './interpolation-helper.component';
import {JobExecutorsCollection} from './job-executors-collection.component';
import {StagesListFactory} from './stages-list-factory.component';
import {ContainerStatusChecker} from './container-status-checker.component';
import {ContainerDetailsWorker} from './container-details-worker.component';
import {ExecuteHostCommandAfterBuildTaskJobExecutor} from './job/execute-host-command-after-build-task.job';
import {ExecuteServiceCommandAfterBuildTaskJobExecutor} from './job/execute-service-command-after-build-task.job';
import {CopyAssetIntoContainerAfterBuildTaskJobExecutor} from './job/copy-asset-into-container-after-build-task.job';
import {CreateVolumeFromAssetJobExecutor} from './job/create-volume-from-asset.job';
import {SpawnHelper} from './spawn-helper.component';
import {AssetHelper} from './asset-helper.component';

@Module({
  imports: [
      LoggerModule,
      PersistenceModule,
  ],
  controllers: [],
  providers: [
      ConnectContainersToNetworkJobExecutor,
      CopyBeforeBuildTaskJobExecutor,
      CreateDirectoryJobExecutor,
      CloneSourceJobExecutor,
      GetContainerIdsJobExecutor,
      InterpolateBeforeBuildTaskJobExecutor,
      ParseDockerComposeJobExecutor,
      PrepareEnvVariablesJobExecutor,
      PreparePortDomainsJobExecutor,
      PrepareSummaryItemsJobExecutor,
      ProxyPortDomainsJobExecutor,
      RunDockerComposeJobExecutor,
      ExecuteHostCommandAfterBuildTaskJobExecutor,
      ExecuteServiceCommandAfterBuildTaskJobExecutor,
      CopyAssetIntoContainerAfterBuildTaskJobExecutor,
      CreateVolumeFromAssetJobExecutor,
      Instantiator,
      InterpolationHelper,
      JobExecutorsCollection,
      StagesListFactory,
      ContainerDetailsWorker,
      ContainerStatusChecker,
      SpawnHelper,
      AssetHelper,
  ],
  exports: [
      Instantiator,
      ContainerStatusChecker,
      AssetHelper,
  ],
})
export class InstantiationModule {}
