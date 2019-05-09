import {Component, EventEmitter, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getProjectListQueryGql,
    GetProjectListQueryInterface,
    GetProjectListQueryProjectsFieldItemInterface,
} from './get-project-list.query';
import {ActionButtonInterface, ActionButtonType} from '../../title/title.component';


@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styles: []
})
export class ProjectListComponent implements OnInit {

    projects: GetProjectListQueryProjectsFieldItemInterface[];

    actions: ActionButtonInterface[];

    constructor(
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.setUpActions();
        this.getProjects();
    }

    protected setUpActions(): void {
        this.actions = [
            {
                type: ActionButtonType.success,
                label: 'Add',
                routerLink: '/project/add',
            },
        ];
    }

    protected getProjects() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetProjectListQueryInterface>({
                query: getProjectListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetProjectListQueryInterface = result.data;
                this.projects = resultData.projects;
                this.spinner.hide();
            });
    }
}
