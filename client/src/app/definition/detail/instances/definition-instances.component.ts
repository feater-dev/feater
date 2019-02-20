import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    GetDefinitionInstancesQueryDefinitionFieldInterface,
    GetDefinitionInstancesQueryInterface,
    getDefinitionInstancesQueryGql,
} from './get-definition-instances.query';

@Component({
    selector: 'app-definition-instances',
    templateUrl: './definition-instances.component.html',
    styles: []
})
export class DefinitionInstancesComponent implements OnInit {

    definition: GetDefinitionInstancesQueryDefinitionFieldInterface;

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
            .watchQuery<GetDefinitionInstancesQueryInterface>({
                query: getDefinitionInstancesQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionInstancesQueryInterface = result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
