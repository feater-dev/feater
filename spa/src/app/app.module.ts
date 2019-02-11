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

import {DefinitionAddComponent} from './definition/add/definition-add.component';
import {DefinitionAddSourceFormElementComponent} from './definition/add/form-element/definition-add.source-form-element.component';
import {DefinitionAddBeforeBuildTaskCopyFormElementComponent} from './definition/add/form-element/definition-add.before-build-task-copy-form-element.component';
import {DefinitionAddBeforeBuildTaskInterpolateFormElementComponent} from './definition/add/form-element/definition-add.before-build-task-interpolate-form-element.component';
import {DefinitionAddProxiedPortFormElementComponent} from './definition/add/form-element/definition-add.proxied-port-form-element.component';
import {DefinitionAddEnvVariableFormElementComponent} from './definition/add/form-element/definition-add.environmental-variable-form-element.component';
import {DefinitionAddSummaryItemFormElementComponent} from './definition/add/form-element/definition-add.summary-item-form-element.component';
import {DefinitionAddComposeFileFormElementComponent} from './definition/add/form-element/definition-add.compose-file-form-element.component';
import {DefinitionDetailComponent} from './definition/detail/definition-detail.component';
import {DefinitionAddVolumeFormElementComponent} from './definition/add/form-element/definition-add.volume-form-element.component';
import {DefinitionListComponent} from './definition/list/definition-list.component';
import {DefinitionTableComponent} from './definition/table/definition-table.component';
import {ExecuteHostCommandTaskFormElementComponent} from './definition/add/form-element/after-build-task/execute-host-command-task-form-element.component';
import {ExecuteServiceCommandTaskFormElementComponent} from './definition/add/form-element/after-build-task/execute-service-command-task-form-element.component';
import {CopyAssetIntoContainerTaskFormElementComponent} from './definition/add/form-element/after-build-task/copy-asset-into-container-task-form-element.component';

import {InstanceAddComponent} from './instance/add/instance-add.component';
import {InstanceListComponent} from './instance/list/instance-list.component';
import {InstanceTableComponent} from './instance/table/instance-table.component';

import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {LinkifyPipe} from './pipes/linkify.pipe';
import {YamlPipe} from './pipes/yaml.pipe';
import {AbsoluteDatePipe} from './pipes/absolute-date.pipe';
import {RelativeDatePipe} from './pipes/relative-date.pipe';
import {InheritedEnvVarsFormElementComponent} from './definition/add/form-element/after-build-task/env/inherited-env-vars-form-element.component';
import {CustomEnvVarsFormElementComponent} from './definition/add/form-element/after-build-task/env/custom-env-vars-form-element.component';
import {ElapsedTimePipe} from './pipes/elapsed-time.pipe';

import {MarkdownToHtmlModule} from 'markdown-to-html-pipe';
import {InstanceDetailSummaryComponent} from './instance/detail/summary/instance-detail-summary.component';
import {InstanceDetailEnvironmentComponent} from './instance/detail/environment/instance-detail-environment.component';
import {InstanceDetailLogsComponent} from './instance/detail/logs/instance-detail-logs.component';
import {InstanceDetailServicesComponent} from './instance/detail/services/instance-detail-services.component';
import {InstanceDetailProxyDomainsComponent} from './instance/detail/proxy-domains/instance-detail-proxy-domains.component';
import {DefinitionDuplicateComponent} from './definition/duplicate/definition-duplicate.component';
import {DefinitionEditComponent} from './definition/edit/definition-edit.component';

import {NgxSpinnerModule} from 'ngx-spinner';
import {TooltipModule} from 'ng2-tooltip-directive';
import {FilterPipeModule} from 'ngx-filter-pipe';

const appRoutes: Routes = [
    { path: '', component: AboutComponent },
    { path: 'projects', component: ProjectListComponent },
    { path: 'project/add', component: ProjectAddComponent },
    { path: 'project/:id', component: ProjectDetailComponent },
    { path: 'project/:id/definition/add', component: DefinitionAddComponent},
    { path: 'project/:id/asset/add', component: AssetAddComponent},
    { path: 'definitions', component: DefinitionListComponent },
    { path: 'definition/:id', component: DefinitionDetailComponent},
    { path: 'definition/:id/edit', component: DefinitionEditComponent},
    { path: 'definition/:id/duplicate', component: DefinitionDuplicateComponent},
    { path: 'definition/:id/instance/add', component: InstanceAddComponent},
    { path: 'instances', component: InstanceListComponent },
    { path: 'instance/:id', component: InstanceDetailSummaryComponent},
    { path: 'instance/:id/environment', component: InstanceDetailEnvironmentComponent},
    { path: 'instance/:id/services', component: InstanceDetailServicesComponent},
    { path: 'instance/:id/proxy-domains', component: InstanceDetailProxyDomainsComponent},
    { path: 'instance/:id/logs', component: InstanceDetailLogsComponent},
    { path: 'assets', component: AssetListComponent },
    { path: 'asset/:id', component: AssetDetailComponent },
    { path: 'deploy-keys', component: DeployKeyListComponent },
    { path: 'deploy-key/:id', component: DeployKeyDetailComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        ProjectAddComponent,
        ProjectDetailComponent,
        ProjectListComponent,
        DefinitionAddComponent,
        DefinitionDuplicateComponent,
        DefinitionEditComponent,
        DefinitionAddSourceFormElementComponent,
        DefinitionAddVolumeFormElementComponent,
        DefinitionAddBeforeBuildTaskCopyFormElementComponent,
        DefinitionAddBeforeBuildTaskInterpolateFormElementComponent,
        DefinitionAddProxiedPortFormElementComponent,
        DefinitionAddEnvVariableFormElementComponent,
        DefinitionAddComposeFileFormElementComponent,
        ExecuteHostCommandTaskFormElementComponent,
        ExecuteServiceCommandTaskFormElementComponent,
        CopyAssetIntoContainerTaskFormElementComponent,
        DefinitionAddSummaryItemFormElementComponent,
        InheritedEnvVarsFormElementComponent,
        CustomEnvVarsFormElementComponent,
        DefinitionDetailComponent,
        DefinitionListComponent,
        InstanceAddComponent,
        InstanceDetailSummaryComponent,
        InstanceDetailEnvironmentComponent,
        InstanceDetailServicesComponent,
        InstanceDetailProxyDomainsComponent,
        InstanceDetailLogsComponent,
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
        const introspectionQueryResultData = {
            __schema: {
                types: [
                    {
                        kind: 'UNION',
                        name: 'BeforeBuildTask',
                        possibleTypes: [
                            {name: 'CopyBeforeBuildTask'},
                            {name: 'InterpolateBeforeBuildTask'},
                            {name: 'ReplaceBeforeBuildTask'},
                        ],
                    },
                    {
                        kind: 'UNION',
                        name: 'AfterBuildTask',
                        possibleTypes: [
                            {name: 'ExecuteHostCommandAfterBuildTask'},
                            {name: 'ExecuteServiceCommandAfterBuildTask'},
                            {name: 'CopyAssetIntoContainerAfterBuildTask'},
                        ],
                    },
                ],
            }
        };

        const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

        apollo.create({
            link: httpLink.create({ uri: environment.apiBaseUrl }),
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
            cache: new InMemoryCache({fragmentMatcher}),
        });
    }
}
