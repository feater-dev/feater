import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

interface Project {
    id: number;
    name: string;
}

interface Query {
    projects: Project[];
}

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styles: []
})
export class ProjectListComponent implements OnInit {

    items: Observable<Project[]>;

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
            .watchQuery<Query>({
                query: gql`query { projects { id name } }`
            })
            .valueChanges
            .pipe(
                map(result => result.data.projects)
            );
    }
}
