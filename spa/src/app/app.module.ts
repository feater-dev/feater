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

import {UserListComponent} from './user/list/user-list.component';

import {ProjectAddComponent} from './project/add/project-add.component';
import {ProjectDetailComponent} from './project/detail/project-detail.component';
import {ProjectListComponent} from './project/list/project-list.component';

import {AssetAddComponent} from './asset/add/asset-add.component';
import {AssetDetailComponent} from './asset/detail/asset-detail.component';
import {AssetListComponent} from './asset/list/asset-list.component';

import {DefinitionAddComponent} from './definition/add/definition-add.component';
import {
    DefinitionAddSourceFormElementComponent
} from './definition/add/form-element/definition-add.source-form-element.component';
import {
    DefinitionAddBeforeBuildTaskCopyFormElementComponent
} from './definition/add/form-element/definition-add.before-build-task-copy-form-element.component';
import {
    DefinitionAddBeforeBuildTaskInterpolateFormElementComponent
} from './definition/add/form-element/definition-add.before-build-task-interpolate-form-element.component';
import {
    DefinitionAddProxiedPortFormElementComponent
} from './definition/add/form-element/definition-add.proxied-port-form-element.component';
import {
    DefinitionAddEnvVariableFormElementComponent
} from './definition/add/form-element/definition-add.environmental-variable-form-element.component';
import {
    DefinitionAddSummaryItemFormElementComponent
} from './definition/add/form-element/definition-add.summary-item-form-element.component';
import {
    DefinitionAddComposeFileFormElementComponent
} from './definition/add/form-element/definition-add.compose-file-form-element.component';
import {
    DefinitionDetailComponent
} from './definition/detail/definition-detail.component';
import {
    DefinitionListComponent
} from './definition/list/definition-list.component';

import {InstanceAddComponent} from './instance/add/instance-add.component';
import {InstanceDetailComponent} from './instance/detail/instance-detail.component';
import {InstanceListComponent} from './instance/list/instance-list.component';

import {AuthHttpClient} from './api/auth-http-client.service';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {LinkifyPipe} from './pipes/linkify.pipe';
import {YamlPipe} from './pipes/yaml.pipe';
import {AbsoluteDatePipe} from './pipes/absolute-date.pipe';
import {RelativeDatePipe} from './pipes/relative-date.pipe';
import {DefinitionAddAfterBuildTaskExecuteHostCommandFormElementComponent} from './definition/add/form-element/definition-add.after-build-task-execute-host-command-form-element.component';
import {DefinitionAddAfterBuildTaskExecuteServiceCommandFormElementComponent} from './definition/add/form-element/definition-add.after-build-task-execute-service-command-form-element.component';
import {DefinitionAddAfterBuildTaskCopyAssetIntoContainerFormElementComponent} from './definition/add/form-element/definition-add.after-build-task-copy-asset-into-container-form-element.component';
import {DefinitionAddVolumeFormElementComponent} from './definition/add/form-element/definition-add.volume-form-element.component';


const appRoutes: Routes = [
    { path: '', component: AboutComponent },
    { path: 'users', component: UserListComponent },
    { path: 'projects', component: ProjectListComponent },
    { path: 'project/add', component: ProjectAddComponent },
    { path: 'project/:id', component: ProjectDetailComponent },
    { path: 'project/:id/definition/add', component: DefinitionAddComponent},
    { path: 'project/:id/asset/add', component: AssetAddComponent},
    { path: 'definitions', component: DefinitionListComponent },
    { path: 'definition/:id', component: DefinitionDetailComponent},
    { path: 'definition/:id/instance/add', component: InstanceAddComponent},
    { path: 'instances', component: InstanceListComponent },
    { path: 'instance/:id', component: InstanceDetailComponent},
    { path: 'assets', component: AssetListComponent },
    { path: 'asset/:id', component: AssetDetailComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        UserListComponent,
        ProjectAddComponent,
        ProjectDetailComponent,
        ProjectListComponent,
        DefinitionAddComponent,
        DefinitionAddSourceFormElementComponent,
        DefinitionAddVolumeFormElementComponent,
        DefinitionAddBeforeBuildTaskCopyFormElementComponent,
        DefinitionAddBeforeBuildTaskInterpolateFormElementComponent,
        DefinitionAddProxiedPortFormElementComponent,
        DefinitionAddEnvVariableFormElementComponent,
        DefinitionAddComposeFileFormElementComponent,
        DefinitionAddAfterBuildTaskExecuteHostCommandFormElementComponent,
        DefinitionAddAfterBuildTaskExecuteServiceCommandFormElementComponent,
        DefinitionAddAfterBuildTaskCopyAssetIntoContainerFormElementComponent,
        DefinitionAddSummaryItemFormElementComponent,
        DefinitionDetailComponent,
        DefinitionListComponent,
        InstanceAddComponent,
        InstanceDetailComponent,
        InstanceListComponent,
        AssetAddComponent,
        AssetDetailComponent,
        AssetListComponent,
        NavbarComponent,
        AboutComponent,
        LinkifyPipe,
        YamlPipe,
        AbsoluteDatePipe,
        RelativeDatePipe,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ApolloModule,
        HttpClientModule,
        HttpLinkModule,
        RouterModule.forRoot(appRoutes),
    ],
    providers: [
        {provide: 'authHttp', useClass: AuthHttpClient},
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
            cache: new InMemoryCache({fragmentMatcher}),
        });
    }
}
