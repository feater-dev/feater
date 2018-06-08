import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

import {InstanceAddForm} from '../../instance/instance-add-form.model';


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

    definition: Definition;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        @Inject('repository.definition') private definitionRepository,
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
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<Query>({
                            query: gql`query ($id: String!) {
                                definition(id: $id) {
                                    id
                                    name
                                }
                            }`,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.definition;
                            })
                        );
                }
            ))
            .subscribe(
                (definition: Definition) => {
                    this.definition = definition;
                }
            );

    }

}
