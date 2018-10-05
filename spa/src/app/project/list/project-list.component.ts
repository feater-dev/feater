import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
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

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.getProjects();
    }

    private getProjects() {
        this.apollo
            .watchQuery<GetProjectListQueryInterface>({
                query: getProjectListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetProjectListQueryInterface = result.data;
                this.projects = resultData.projects;
            });
    }
}
