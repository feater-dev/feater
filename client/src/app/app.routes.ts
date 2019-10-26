import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ProjectAddComponent } from './project/add/project-add.component';
import { ProjectDetailComponent } from './project/detail/project-detail.component';
import { ProjectListComponent } from './project/list/project-list.component';
import { AssetAddComponent } from './asset/add/asset-add.component';
import { AssetDetailComponent } from './asset/detail/asset-detail.component';
import { AssetListComponent } from './asset/list/asset-list.component';
import { DeployKeyListComponent } from './deploy-key/list/deploy-key-list.component';
import { DeployKeyDetailComponent } from './deploy-key/detail/deploy-key-detail.component';
import { DefinitionSummaryComponent } from './definition/detail/summary/definition-summary.component';
import { DefinitionRecipeComponent } from './definition/detail/recipe/definition-recipe.component';
import { DefinitionDeployKeysComponent } from './definition/detail/deploy-keys/definition-deploy-keys.component';
import { DefinitionEnvironmentComponent } from './definition/detail/environment/definition-environment.component';
import { DefinitionSubstitutionsComponent } from './definition/detail/substitutions/definition-substitutions.component';
import { DefinitionInstancesComponent } from './definition/detail/instances/definition-instances.component';
import { DefinitionAddComponent } from './definition/add/definition-add.component';
import { DefinitionListComponent } from './definition/list/definition-list.component';
import { InstanceAddComponent } from './instance/add/instance-add.component';
import { InstanceListComponent } from './instance/list/instance-list.component';
import { InstanceSummaryComponent } from './instance/detail/summary/instance-summary.component';
import { InstanceEnvironmentComponent } from './instance/detail/environment/instance-environment.component';
import { InstanceLogsComponent } from './instance/detail/logs/instance-logs.component';
import { InstanceServicesComponent } from './instance/detail/services/instance-services.component';
import { InstanceProxyDomainsComponent } from './instance/detail/proxy-domains/instance-proxy-domains.component';
import { DefinitionDuplicateComponent } from './definition/duplicate/definition-duplicate.component';
import { DefinitionEditComponent } from './definition/edit/definition-edit.component';
import { InstanceDownloadablesComponent } from './instance/detail/downloadables/instance-downloadables.component';

export const appRoutes: Routes = [
    {
        path: 'projects',
        component: ProjectListComponent,
    },
    {
        path: 'project/add',
        component: ProjectAddComponent,
    },
    {
        path: 'project/:id',
        component: ProjectDetailComponent,
    },
    {
        path: 'project/:id/definition/add',
        component: DefinitionAddComponent,
    },
    {
        path: 'project/:id/asset/add',
        component: AssetAddComponent,
    },
    {
        path: 'definitions',
        component: DefinitionListComponent,
    },
    {
        path: 'definition/:id',
        component: DefinitionSummaryComponent,
    },
    {
        path: 'definition/:id/recipe',
        component: DefinitionRecipeComponent,
    },
    {
        path: 'definition/:id/deploy-keys',
        component: DefinitionDeployKeysComponent,
    },
    {
        path: 'definition/:id/substitutions',
        component: DefinitionSubstitutionsComponent,
    },
    {
        path: 'definition/:id/environment',
        component: DefinitionEnvironmentComponent,
    },
    {
        path: 'definition/:id/instances',
        component: DefinitionInstancesComponent,
    },
    {
        path: 'definition/:id/edit',
        component: DefinitionEditComponent,
    },
    {
        path: 'definition/:id/duplicate',
        component: DefinitionDuplicateComponent,
    },
    {
        path: 'definition/:id/instance/add',
        component: InstanceAddComponent,
    },
    {
        path: 'instances',
        component: InstanceListComponent,
    },
    {
        path: 'instance/:id',
        component: InstanceSummaryComponent,
    },
    {
        path: 'instance/:id/environment',
        component: InstanceEnvironmentComponent,
    },
    {
        path: 'instance/:id/downloadables',
        component: InstanceDownloadablesComponent,
    },
    {
        path: 'instance/:id/services',
        component: InstanceServicesComponent,
    },
    {
        path: 'instance/:id/proxy-domains',
        component: InstanceProxyDomainsComponent,
    },
    {
        path: 'instance/:id/build-logs',
        component: InstanceLogsComponent,
    },
    {
        path: 'assets',
        component: AssetListComponent,
    },
    {
        path: 'asset/:projectId/:id',
        component: AssetDetailComponent,
    },
    {
        path: 'deploy-keys',
        component: DeployKeyListComponent,
    },
    {
        path: 'deploy-key/:id',
        component: DeployKeyDetailComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: '**',
        redirectTo: 'projects',
        pathMatch: 'full',
    },
];
