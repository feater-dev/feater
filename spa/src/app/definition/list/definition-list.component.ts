import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

interface Definition {
    id: number;
    name: string;
}

interface Query {
    definitions: Definition[];
}

@Component({
    selector: 'app-definition-list',
    templateUrl: './definition-list.component.html',
    styles: []
})
export class DefinitionListComponent implements OnInit {

    items: Observable<Definition[]>;

    constructor(
        private router: Router,
        @Inject('repository.definition') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/definition', item.id]);
    }

    private getItems() {
        this.items = this.apollo
            .watchQuery<Query>({
                query: gql`query { definitions { id name } }`
            })
            .valueChanges
            .pipe(
                map(result => result.data.definitions)
            );
    }
}
