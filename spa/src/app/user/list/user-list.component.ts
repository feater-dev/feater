import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
    getuserListQueryGql,
    GetUserListQueryInterface,
    GetUserListQueryUsersFieldItemInterface,
} from './get-user-list.query';


@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styles: []
})
export class UserListComponent implements OnInit {

    users: GetUserListQueryUsersFieldItemInterface[];

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.getUsers();
    }

    private getUsers() {
        this.apollo
            .watchQuery<GetUserListQueryInterface>({
                query: getuserListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                    const resultData: GetUserListQueryInterface = result.data;
                    this.users = resultData.users;
            });
    }
}
