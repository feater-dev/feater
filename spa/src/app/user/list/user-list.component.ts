import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {GetUserResponseDto} from '../user-response-dtos';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styles: []
})
export class UserListComponent implements OnInit {

    items: GetUserResponseDto[];

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.user') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    private getItems() {
        this.repository
            .getItems()
            .subscribe(
                (items: GetUserResponseDto[]) => { this.items = items; },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
