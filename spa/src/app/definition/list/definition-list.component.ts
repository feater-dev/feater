import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    GetDefinitionListQueryDefinitionsFieldItemInterface,
    getDefinitionListQueryGql,
    GetDefinitionListQueryInterface
} from './get-definition-list.query';


@Component({
    selector: 'app-definition-list',
    templateUrl: './definition-list.component.html',
    styles: []
})
export class DefinitionListComponent implements OnInit {

    items: Observable<GetDefinitionListQueryDefinitionsFieldItemInterface[]>;

    constructor(
        private router: Router,
        @Inject('repository.definition') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/definition', item.id]);
    }

    private getItems() {
        this.items = this.apollo
            .watchQuery<GetDefinitionListQueryInterface>({
                query: getDefinitionListQueryGql
            })
            .valueChanges
            .pipe(
                map(result => result.data.definitions)
            );
    }
}
