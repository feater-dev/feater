import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {GetInstanceResponseDto} from '../instance-response-dtos.model';

@Component({
    selector: 'app-instance-list',
    templateUrl: './instance-list.component.html',
    styles: []
})
export class InstanceListComponent implements OnInit {

    items: GetInstanceResponseDto[];

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.build') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/instance', item._id]);
    }

    private getItems() {
        this.repository
            .getItems()
            .subscribe(
                (items: GetInstanceResponseDto[]) => { this.items = items; },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
