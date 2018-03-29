import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';

import { UserListComponent } from './user/list/user-list.component';

import { ProjectAddComponent } from './project/add/project-add.component';
import { ProjectDetailComponent } from './project/detail/project-detail.component';
import { ProjectListComponent } from './project/list/project-list.component';

import { BuildDefinitionAddComponent } from './build-definition/add/build-definition-add.component';
import { BuildDefinitionAddSourceFormElementComponent } from './build-definition/add/form-element/build-definition-add.source-form-element.component';
import { BuildDefinitionAddBeforeBuildTaskCopyFormElementComponent } from './build-definition/add/form-element/build-definition-add.before-build-task-copy-form-element.component';
import { BuildDefinitionAddBeforeBuildTaskInterpolateFormElementComponent } from './build-definition/add/form-element/build-definition-add.before-build-task-interpolate-form-element.component';
import { BuildDefinitionAddExposedPortFormElementComponent } from './build-definition/add/form-element/build-definition-add.exposed-port-form-element.component';
import { BuildDefinitionAddEnvironmentalVariableFormElementComponent } from './build-definition/add/form-element/build-definition-add.environmental-variable-form-element.component';
import { BuildDefinitionAddSummaryItemFormElementComponent } from './build-definition/add/form-element/build-definition-add.summary-item-form-element.component';
import { BuildDefinitionAddComposeFileFormElementComponent } from './build-definition/add/form-element/build-definition-add.compose-file-form-element.component';
import { BuildDefinitionDetailComponent } from './build-definition/detail/build-definition-detail.component';
import { BuildDefinitionListComponent } from './build-definition/list/build-definition-list.component';

import { BuildInstanceAddComponent } from './build-instance/add/build-instance-add.component';
import { BuildInstanceDetailComponent } from './build-instance/detail/build-instance-detail.component';
import { BuildInstanceListComponent } from './build-instance/list/build-instance-list.component';

import { UserRepositoryService } from './user/repository/user-repository.service';
import { ProjectRepositoryService } from './project/repository/project-repository.service';
import { BuildDefinitionRepositoryService } from './build-definition/repository/build-definition-repository.service';
import { BuildInstanceRepositoryService } from './build-instance/repository/build-instance-repository.service';
import {AuthHttp} from './api/auth-http';

const appRoutes: Routes = [
    { path: '', component: AboutComponent },
    { path: 'users', component: UserListComponent },
    { path: 'projects', component: ProjectListComponent },
    { path: 'project/add', component: ProjectAddComponent },
    { path: 'project/:id', component: ProjectDetailComponent },
    { path: 'project/:id/build-definition/add', component: BuildDefinitionAddComponent},
    { path: 'build-definitions', component: BuildDefinitionListComponent },
    { path: 'build-definition/:id', component: BuildDefinitionDetailComponent},
    { path: 'build-definition/:id/build-instance/add', component: BuildInstanceAddComponent},
    { path: 'build-instances', component: BuildInstanceListComponent },
    { path: 'build-instance/:id', component: BuildInstanceDetailComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        UserListComponent,
        ProjectAddComponent,
        ProjectDetailComponent,
        ProjectListComponent,
        BuildDefinitionAddComponent,
        BuildDefinitionAddSourceFormElementComponent,
        BuildDefinitionAddBeforeBuildTaskCopyFormElementComponent,
        BuildDefinitionAddBeforeBuildTaskInterpolateFormElementComponent,
        BuildDefinitionAddExposedPortFormElementComponent,
        BuildDefinitionAddEnvironmentalVariableFormElementComponent,
        BuildDefinitionAddSummaryItemFormElementComponent,
        BuildDefinitionAddComposeFileFormElementComponent,
        BuildDefinitionDetailComponent,
        BuildDefinitionListComponent,
        BuildInstanceAddComponent,
        BuildInstanceDetailComponent,
        BuildInstanceListComponent,
        NavbarComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        {provide: 'authHttp', useClass: AuthHttp},
        {provide: 'repository.user', useClass: UserRepositoryService},
        {provide: 'repository.project', useClass: ProjectRepositoryService},
        {provide: 'repository.buildDefinition', useClass: BuildDefinitionRepositoryService},
        {provide: 'repository.build', useClass: BuildInstanceRepositoryService}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
