import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {GetBuildDefinitionResponseDto} from '../build-definition-response-dtos.model';

@Component({
    selector: 'app-build-definition-list',
    templateUrl: './build-definition-list.component.html',
    styles: []
})
export class BuildDefinitionListComponent implements OnInit {

    items: GetBuildDefinitionResponseDto[];

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.buildDefinition') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/build-definition', item._id]);
    }

    private getItems() {
        this.repository
            .getItems()
            .subscribe(
                (items: GetBuildDefinitionResponseDto[]) => { this.items = items; },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
