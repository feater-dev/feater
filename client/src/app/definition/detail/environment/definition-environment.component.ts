import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    GetDefinitionEnvironmentQueryDefinitionFieldInterface,
    GetDefinitionEnvironmentQueryInterface,
    getDefinitionEnvironmentQueryGql,
} from './get-definition-environment.query';
import {DefinitionTabs} from '../tabs/definition-tabs.component';

@Component({
    selector: 'app-definition-environment',
    templateUrl: './definition-environment.component.html',
    styles: []
})
export class DefinitionEnvironmentComponent implements OnInit {

    readonly definitionTabs = DefinitionTabs;

    definition: GetDefinitionEnvironmentQueryDefinitionFieldInterface;

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
            .watchQuery<GetDefinitionEnvironmentQueryInterface>({
                query: getDefinitionEnvironmentQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionEnvironmentQueryInterface = result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
