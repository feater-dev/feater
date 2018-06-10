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

    items: Observable<GetProjectListQueryProjectsFieldItemInterface[]>;

    constructor(
        private router: Router,
        @Inject('repository.project') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/project', item.id]);
    }

    goToAdd() {
        this.router.navigate(['/project/add']);
    }

    private getItems() {
        this.items = this.apollo
            .watchQuery<GetProjectListQueryInterface>({
                query: getProjectListQueryGql,
            })
            .valueChanges
            .pipe(
                map(result => result.data.projects)
            );
    }
}
