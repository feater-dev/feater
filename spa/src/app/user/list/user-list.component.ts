import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user.model';

@Component({
    selector: 'app-user-list',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2 id="tables">Users</h2>
                </div>
                <table class="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>GitHub username</th>
                            <th>Google email address</th>
                            <th class="fit-column">Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of items">
                            <td>{{ item.name }}</td>
                            <td>{{ item.githubProfile?.username || '&mdash;' }}</td>
                            <td>{{ item.googleProfile?.emailAddress || '&mdash;' }}</td>
                            <td class="fit-column"><small>{{ item._id }}</small></td>
                        </tr>
                    </tbody>
                </table> 
            </div>
        </div>
    `,
    styles: []
})
export class UserListComponent implements OnInit {

    items: User[];

    errorMessage: string;

    constructor(
            private router: Router,
            @Inject('repository.user') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    private getItems() {
        this
                .repository
                .getItems()
                .subscribe(
                        (items: User[]) => { this.items = items; },
                        (error) => { this.errorMessage = <any>error; }
                );
    }
}
