import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    GetDefinitionSubstitutionsQueryDefinitionFieldInterface,
    GetDefinitionSubstitutionsQueryInterface,
    getDefinitionSubstitutionsQueryGql,
} from './get-definition-substitutions.query';

@Component({
    selector: 'app-definition-substitutions',
    templateUrl: './definition-substitutions.component.html',
    styles: []
})
export class DefinitionSubstitutionsComponent implements OnInit {

    definition: GetDefinitionSubstitutionsQueryDefinitionFieldInterface;

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
            .watchQuery<GetDefinitionSubstitutionsQueryInterface>({
                query: getDefinitionSubstitutionsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionSubstitutionsQueryInterface = result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
