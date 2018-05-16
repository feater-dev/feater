import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {GetBuildInstanceResponseDto} from '../build-instance-response-dtos.model';

@Component({
    selector: 'app-build-instance-list',
    templateUrl: './build-instance-list.component.html',
    styles: []
})
export class BuildInstanceListComponent implements OnInit {

    items: GetBuildInstanceResponseDto[];

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.build') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/build-instance', item._id]);
    }

    private getItems() {
        this.repository
            .getItems()
            .subscribe(
                (items: GetBuildInstanceResponseDto[]) => { this.items = items; },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
