import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {GetProjectResponseDto} from '../project-response-dtos.model';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styles: []
})
export class ProjectListComponent implements OnInit {

    items: GetProjectResponseDto[];

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.project') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/project', item._id]);
    }

    goToAdd() {
        this.router.navigate(['/project/add']);
    }

    private getItems() {
        this.repository
            .getItems()
            .subscribe(
                (items: GetProjectResponseDto[]) => { this.items = items; },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
