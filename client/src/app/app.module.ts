import {environment} from './../environments/environment';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';

import {AppComponent} from './app.component';

import {NavbarComponent} from './navbar/navbar.component';
import {AboutComponent} from './about/about.component';

import {ProjectAddComponent} from './project/add/project-add.component';
import {ProjectDetailComponent} from './project/detail/project-detail.component';
import {ProjectListComponent} from './project/list/project-list.component';
import {ProjectTableComponent} from './project/table/project-table.component';

import {AssetAddComponent} from './asset/add/asset-add.component';
import {AssetDetailComponent} from './asset/detail/asset-detail.component';
import {AssetListComponent} from './asset/list/asset-list.component';
import {AssetTableComponent} from './asset/table/asset-table.component';

import {DeployKeyListComponent} from './deploy-key/list/deploy-key-list.component';
import {DeployKeyDetailComponent} from './deploy-key/detail/deploy-key-detail.component';
import {DeployKeyTableComponent} from './deploy-key/table/deploy-key-table.component';

import {DefinitionSummaryComponent} from './definition/detail/summary/definition-summary.component';
import {DefinitionRecipeComponent} from './definition/detail/recipe/definition-recipe.component';
import {DefinitionDeployKeysComponent} from './definition/detail/deploy-keys/definition-deploy-keys.component';
import {DefinitionEnvironmentComponent} from './definition/detail/environment/definition-environment.component';
import {DefinitionSubstitutionsComponent} from './definition/detail/substitutions/definition-substitutions.component';
import {DefinitionInstancesComponent} from './definition/detail/instances/definition-instances.component';
import {DefinitionAddComponent} from './definition/add/definition-add.component';
import {DefinitionAddSourceFormElementComponent} from './definition/add/form-element/definition-add.source-form-element.component';
import {DefinitionAddBeforeBuildTaskCopyFormElementComponent} from './definition/add/form-element/definition-add.before-build-task-copy-form-element.component';
import {DefinitionAddBeforeBuildTaskInterpolateFormElementComponent} from './definition/add/form-element/definition-add.before-build-task-interpolate-form-element.component';
import {DefinitionAddProxiedPortFormElementComponent} from './definition/add/form-element/definition-add.proxied-port-form-element.component';
import {DefinitionAddEnvVariableFormElementComponent} from './definition/add/form-element/definition-add.environmental-variable-form-element.component';
import {DefinitionAddSummaryItemFormElementComponent} from './definition/add/form-element/definition-add.summary-item-form-element.component';
import {DefinitionAddComposeFileFormElementComponent} from './definition/add/form-element/definition-add.compose-file-form-element.component';
import {DefinitionAddAssetVolumeFormElementComponent} from './definition/add/form-element/definition-add.asset-volume-form-element.component';
import {DefinitionListComponent} from './definition/list/definition-list.component';
import {DefinitionTableComponent} from './definition/table/definition-table.component';
import {ExecuteServiceCommandTaskFormElementComponent} from './definition/add/form-element/after-build-task/execute-service-command-task-form-element.component';
import {CopyAssetIntoContainerTaskFormElementComponent} from './definition/add/form-element/after-build-task/copy-asset-into-container-task-form-element.component';

import {InstanceAddComponent} from './instance/add/instance-add.component';
import {InstanceListComponent} from './instance/list/instance-list.component';
import {InstanceTableComponent} from './instance/table/instance-table.component';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {LinkifyPipe} from './pipes/linkify.pipe';
import {YamlPipe} from './pipes/yaml.pipe';
import {AbsoluteDatePipe} from './pipes/absolute-date.pipe';
import {RelativeDatePipe} from './pipes/relative-date.pipe';
import {InheritedEnvVarsFormElementComponent} from './definition/add/form-element/after-build-task/env/inherited-env-vars-form-element.component';
import {CustomEnvVarsFormElementComponent} from './definition/add/form-element/after-build-task/env/custom-env-vars-form-element.component';
import {ElapsedTimePipe} from './pipes/elapsed-time.pipe';

import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {InstanceSummaryComponent} from './instance/detail/summary/instance-summary.component';
import {InstanceEnvironmentComponent} from './instance/detail/environment/instance-environment.component';
import {InstanceLogsComponent} from './instance/detail/logs/instance-logs.component';
import {InstanceServicesComponent} from './instance/detail/services/instance-services.component';
import {InstanceProxyDomainsComponent} from './instance/detail/proxy-domains/instance-proxy-domains.component';
import {DefinitionDuplicateComponent} from './definition/duplicate/definition-duplicate.component';
import {DefinitionEditComponent} from './definition/edit/definition-edit.component';

import {NgxSpinnerModule} from 'ngx-spinner';
import {TooltipModule} from 'ng2-tooltip-directive';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import {ConfirmComponent} from './modal/confirm.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {TitleComponent} from './title/title.component';
import {DefinitionTabsComponent} from './definition/detail/tabs/definition-tabs.component';
import {InstanceTabsComponent} from './instance/detail/tabs/instance-tabs.component';
import {DefinitionRecipeFormComponent} from './definition/recipe-form/definition-recipe-form.component';
import {ImportDefinitionRecipeYamlComponent} from './definition/import-yaml/import-definition-recipe-yaml.component';
import {DefinitionRecipeYamlMapperService} from './definition/import-yaml/definition-recipe-yaml-mapper.service';
import {DefinitionAddSourceVolumeFormElementComponent} from './definition/add/form-element/definition-add.source-volume-form-element.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';

const appRoutes: Routes = [
    { path: 'projects', component: ProjectListComponent },
    { path: 'project/add', component: ProjectAddComponent },
    { path: 'project/:id', component: ProjectDetailComponent },
    { path: 'project/:id/definition/add', component: DefinitionAddComponent},
    { path: 'project/:id/asset/add', component: AssetAddComponent},
    { path: 'definitions', component: DefinitionListComponent },
    { path: 'definition/:id', component: DefinitionSummaryComponent},
    { path: 'definition/:id/recipe', component: DefinitionRecipeComponent},
    { path: 'definition/:id/deploy-keys', component: DefinitionDeployKeysComponent},
    { path: 'definition/:id/substitutions', component: DefinitionSubstitutionsComponent},
    { path: 'definition/:id/environment', component: DefinitionEnvironmentComponent},
    { path: 'definition/:id/instances', component: DefinitionInstancesComponent},
    { path: 'definition/:id/edit', component: DefinitionEditComponent},
    { path: 'definition/:id/duplicate', component: DefinitionDuplicateComponent},
    { path: 'definition/:id/instance/add', component: InstanceAddComponent},
    { path: 'instances', component: InstanceListComponent },
    { path: 'instance/:id', component: InstanceSummaryComponent},
    { path: 'instance/:id/environment', component: InstanceEnvironmentComponent},
    { path: 'instance/:id/services', component: InstanceServicesComponent},
    { path: 'instance/:id/proxy-domains', component: InstanceProxyDomainsComponent},
    { path: 'instance/:id/build-logs', component: InstanceLogsComponent},
    { path: 'assets', component: AssetListComponent },
    { path: 'asset/:projectId/:id', component: AssetDetailComponent },
    { path: 'deploy-keys', component: DeployKeyListComponent },
    { path: 'deploy-key/:id', component: DeployKeyDetailComponent },
    { path: 'about', component: AboutComponent },
    { path: '**', redirectTo: 'projects', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        ProjectAddComponent,
        ProjectDetailComponent,
        ProjectListComponent,
        DefinitionRecipeFormComponent,
        ImportDefinitionRecipeYamlComponent,
        DefinitionAddComponent,
        DefinitionDuplicateComponent,
        DefinitionEditComponent,
        DefinitionAddSourceFormElementComponent,
        DefinitionAddSourceVolumeFormElementComponent,
        DefinitionAddAssetVolumeFormElementComponent,
        DefinitionAddBeforeBuildTaskCopyFormElementComponent,
        DefinitionAddBeforeBuildTaskInterpolateFormElementComponent,
        DefinitionAddProxiedPortFormElementComponent,
        DefinitionAddEnvVariableFormElementComponent,
        DefinitionAddComposeFileFormElementComponent,
        ExecuteServiceCommandTaskFormElementComponent,
        CopyAssetIntoContainerTaskFormElementComponent,
        DefinitionAddSummaryItemFormElementComponent,
        InheritedEnvVarsFormElementComponent,
        CustomEnvVarsFormElementComponent,
        DefinitionSummaryComponent,
        DefinitionRecipeComponent,
        DefinitionDeployKeysComponent,
        DefinitionSubstitutionsComponent,
        DefinitionEnvironmentComponent,
        DefinitionInstancesComponent,
        DefinitionListComponent,
        InstanceAddComponent,
        InstanceSummaryComponent,
        InstanceEnvironmentComponent,
        InstanceServicesComponent,
        InstanceProxyDomainsComponent,
        InstanceLogsComponent,
        InstanceListComponent,
        AssetAddComponent,
        AssetDetailComponent,
        AssetListComponent,
        DeployKeyListComponent,
        DeployKeyDetailComponent,
        NavbarComponent,
        AboutComponent,
        ProjectTableComponent,
        DefinitionTableComponent,
        InstanceTableComponent,
        DeployKeyTableComponent,
        AssetTableComponent,
        LinkifyPipe,
        YamlPipe,
        AbsoluteDatePipe,
        RelativeDatePipe,
        ElapsedTimePipe,
        ConfirmComponent,
        TitleComponent,
        DefinitionTabsComponent,
        InstanceTabsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ApolloModule,
        HttpClientModule,
        HttpLinkModule,
        RouterModule.forRoot(appRoutes),
        MarkdownToHtmlModule,
        NgxSpinnerModule,
        TooltipModule,
        FilterPipeModule,
        BootstrapModalModule.forRoot({container: document.body}),
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            enableHtml: true,
            positionClass: 'toast-bottom-right',
        }),
        NgxTrimDirectiveModule,
    ],
    entryComponents: [
        ConfirmComponent,
    ],
    providers: [
        DefinitionRecipeYamlMapperService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
    constructor(
        apollo: Apollo,
        httpLink: HttpLink
    ) {
        apollo.create({
            link: httpLink.create({ uri: [environment.serverBaseUrl, 'api'].join('/') }),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'ignore',
                },
                query: {
                    fetchPolicy: 'no-cache',
                    errorPolicy: 'all',
                },
            },
            cache: new InMemoryCache(),
        });
    }
}
