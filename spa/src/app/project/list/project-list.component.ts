import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
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

    constructor(
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getProjects();
    }

    goToDetail(project) {
        this.router.navigate(['/project', project.id]);
    }

    goToAdd() {
        this.router.navigate(['/project/add']);
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
