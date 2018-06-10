import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {getuserListQueryGql, GetUserListQueryInterface, GetUserListQueryUsersFieldItemInterface} from './get-user-list.query';


@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styles: []
})
export class UserListComponent implements OnInit {

    items: Observable<GetUserListQueryUsersFieldItemInterface[]>;

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
            .watchQuery<GetUserListQueryInterface>({
                query: getuserListQueryGql,
            })
            .valueChanges
            .pipe(
                map(result => result.data.users)
            );
    }
}
