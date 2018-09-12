import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

import {InstanceAddForm} from './instance-add-form.model';
import {GetDefinitionQueryDefinitionFieldInterface, getDefinitionQueryGql, GetDefinitionQueryInterface} from './get-definition.query';


interface Definition {
    id: string;
}

interface Query {
    definition: Definition;
}


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

    goToList() {
        this.router.navigate(['/instances']);
    }

    addItem() {
        this.apollo.mutate({
            mutation: this.mutation,
            variables: {
                definitionId: this.definition.id,
                name: this.item.name,
            },
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
