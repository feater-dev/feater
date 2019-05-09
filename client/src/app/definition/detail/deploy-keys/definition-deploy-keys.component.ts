import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    GetDefinitionDeployKeysQueryDefinitionFieldInterface,
    GetDefinitionDeployKeysQueryInterface,
    getDefinitionDeployKeysQueryGql,
} from './get-definition-deploy-keys.query';
import {DefinitionTabs} from '../tabs/definition-tabs.component';

@Component({
    selector: 'app-definition-deploy-keys',
    templateUrl: './definition-deploy-keys.component.html',
    styles: []
})
export class DefinitionDeployKeysComponent implements OnInit {

    readonly definitionTabs = DefinitionTabs;

    definition: GetDefinitionDeployKeysQueryDefinitionFieldInterface;

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
            .watchQuery<GetDefinitionDeployKeysQueryInterface>({
                query: getDefinitionDeployKeysQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionDeployKeysQueryInterface = result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
