import {Component, Inject, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
    GetDefinitionListQueryDefinitionsFieldItemInterface,
    GetDefinitionListQueryInterface,
    getDefinitionListQueryGql,
} from './get-definition-list.query';


@Component({
    selector: 'app-definition-list',
    templateUrl: './definition-list.component.html',
    styles: []
})
export class DefinitionListComponent implements OnInit {

    definitions: GetDefinitionListQueryDefinitionsFieldItemInterface[];

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.getDefinitions();
    }

    private getDefinitions() {
        this.apollo
            .watchQuery<GetDefinitionListQueryInterface>({
                query: getDefinitionListQueryGql
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionListQueryInterface= result.data;
                this.definitions = resultData.definitions;
            });
    }
}
