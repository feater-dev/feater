import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getProjectListQueryGql,
    GetProjectListQueryInterface,
    GetProjectListQueryProjectsFieldItemInterface,
} from './get-project-list.query';


@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styles: []
})
export class ProjectListComponent implements OnInit {

    projects: GetProjectListQueryProjectsFieldItemInterface[];

    constructor(
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getProjects();
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
