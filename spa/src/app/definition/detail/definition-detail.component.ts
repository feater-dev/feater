import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    GetDefinitionDetailQueryDefinitionFieldInterface,
    GetDefinitionDetailQueryInterface,
    getDefinitionDetailQueryGql,
} from './get-definition-detail.query';
import gql from 'graphql-tag';


@Component({
    selector: 'app-definition-detail',
    templateUrl: './definition-detail.component.html',
    styles: []
})
export class DefinitionDetailComponent implements OnInit {

    definition: GetDefinitionDetailQueryDefinitionFieldInterface;

    protected readonly removeDefinitionMutation = gql`
        mutation ($id: String!) {
            removeDefinition(id: $id)
        }
    `;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getDefinitions();
    }

    removeDefinition() {
        if (this.definition.instances.length) {
            return;
        }

        this.apollo.mutate({
            mutation: this.removeDefinitionMutation,
            variables: {
                id: this.definition.id,
            },
        }).subscribe(
            () => {
                this.router.navigateByUrl(`/project/${this.definition.project.id}`);
            }
        );
    }

    protected getDefinitions() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetDefinitionDetailQueryInterface>({
                query: getDefinitionDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionDetailQueryInterface = result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
