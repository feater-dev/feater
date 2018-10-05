import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {InstanceAddForm} from './instance-add-form.model';
import {
    GetDefinitionQueryDefinitionFieldInterface,
    GetDefinitionQueryInterface,
    getDefinitionQueryGql,
} from './get-definition.query';
import {getDefinitionDetailQueryGql} from '../../definition/detail/get-definition-detail.query';
import {getInstanceListQueryGql} from '../list/get-instance-list.query';
import {getDefinitionListQueryGql} from '../../definition/list/get-definition-list.query';


@Component({
    selector: 'app-instance-add',
    templateUrl: './instance-add.component.html',
    styles: []
})
export class InstanceAddComponent implements OnInit {

    protected readonly mutation = gql`
        mutation ($definitionId: String!, $name: String!) {
            createInstance(definitionId: $definitionId, name: $name) {
                id
            }
        }
    `;

    item: InstanceAddForm;

    definition: GetDefinitionQueryDefinitionFieldInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {
        this.item = {
            name: ''
        };
    }

    ngOnInit() {
        this.getDefinition();
    }

    addItem() {
        this.apollo.mutate({
            mutation: this.mutation,
            variables: {
                definitionId: this.definition.id,
                name: this.item.name,
            },
            refetchQueries: [
                {
                    query: getDefinitionDetailQueryGql,
                    variables: {id: this.definition.id},
                },
                {query: getDefinitionListQueryGql},
                {query: getInstanceListQueryGql},
            ],
        }).subscribe(
            ({data}) => {
                this.router.navigate(['/instance', data.createInstance.id]);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    private getDefinition() {
        this.apollo
            .watchQuery<GetDefinitionQueryInterface>({
                query: getDefinitionQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDefinitionQueryInterface = result.data;
                this.definition = resultData.definition;
            });
    }

}
