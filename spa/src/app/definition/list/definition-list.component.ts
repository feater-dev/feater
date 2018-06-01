import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {GetDefinitionResponseDto} from '../definition-response-dtos.model';

@Component({
    selector: 'app-definition-list',
    templateUrl: './definition-list.component.html',
    styles: []
})
export class DefinitionListComponent implements OnInit {

    items: GetDefinitionResponseDto[];

    errorMessage: string;

    constructor(
        private router: Router,
        @Inject('repository.definition') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/definition', item._id]);
    }

    private getItems() {
        this.repository
            .getItems()
            .subscribe(
                (items: GetDefinitionResponseDto[]) => { this.items = items; },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
