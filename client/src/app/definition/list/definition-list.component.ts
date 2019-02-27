import {Component, Inject, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
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

    constructor(
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getDefinitions();
    }

    protected getDefinitions() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetDefinitionListQueryInterface>({
                query: getDefinitionListQueryGql
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionListQueryInterface= result.data;
                this.definitions = resultData.definitions;
                this.spinner.hide();
            });
    }
}
