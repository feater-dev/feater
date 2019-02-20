import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    GetDefinitionConfigurationQueryDefinitionFieldInterface,
    GetDefinitionConfigurationQueryInterface,
    getDefinitionConfigurationQueryGql,
} from './get-definition-configuration.query';

@Component({
    selector: 'app-definition-configuration',
    templateUrl: './definition-configuration.component.html',
    styles: []
})
export class DefinitionConfigurationComponent implements OnInit {

    definition: GetDefinitionConfigurationQueryDefinitionFieldInterface;

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
            .watchQuery<GetDefinitionConfigurationQueryInterface>({
                query: getDefinitionConfigurationQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionConfigurationQueryInterface = result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
