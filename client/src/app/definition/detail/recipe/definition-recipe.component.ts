import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    GetDefinitionRecipeQueryDefinitionFieldInterface,
    GetDefinitionRecipeQueryInterface,
    getDefinitionRecipeQueryGql,
} from './get-definition-recipe.query';
import { DefinitionTabs } from '../tabs/definition-tabs.component';

@Component({
    selector: 'app-definition-recipe',
    templateUrl: './definition-recipe.component.html',
    styles: [],
})
export class DefinitionRecipeComponent implements OnInit {
    readonly definitionTabs = DefinitionTabs;

    definition: GetDefinitionRecipeQueryDefinitionFieldInterface;

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getDefinition();
    }

    protected getDefinition() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetDefinitionRecipeQueryInterface>({
                query: getDefinitionRecipeQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetDefinitionRecipeQueryInterface =
                    result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
