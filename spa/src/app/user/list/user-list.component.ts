import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

interface User {
    id: number;
    name: string;
}

interface Query {
    instances: User[];
    githubProfile: {
        username: string;
    };
    googleProfile: {
        emailAddress: string;
    };
}

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styles: []
})
export class UserListComponent implements OnInit {

    items: Observable<User[]>;

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.user') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    private getItems() {
        this.items = this.apollo
            .watchQuery<Query>({
                query: gql`query { users { id name githubProfile { username } googleProfile { emailAddress } } }`
            })
            .valueChanges
            .pipe(
                map(result => result.data.users)
            );
    }
}
