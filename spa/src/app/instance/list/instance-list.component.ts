import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

interface Instance {
    id: number;
    name: string;
}

interface Query {
    instances: Instance[];
}

@Component({
    selector: 'app-instance-list',
    templateUrl: './instance-list.component.html',
    styles: []
})
export class InstanceListComponent implements OnInit {

    items: Observable<Instance[]>;

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.build') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/instance', item._id]);
    }

    private getItems() {
        this.items = this.apollo
            .watchQuery<Query>({
                query: gql`query { instances { id name } }`
            })
            .valueChanges
            .pipe(
                map(result => result.data.instances)
            );
    }
}
