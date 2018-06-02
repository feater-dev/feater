import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

import {InstanceAddForm} from '../../instance/instance-add-form.model';
import {GetDefinitionResponseDto} from '../../definition/definition-response-dtos.model';


@Component({
    selector: 'app-instance-add',
    templateUrl: './instance-add.component.html',
    styles: []
})
export class InstanceAddComponent implements OnInit {

    protected readonly mutation = gql`
        mutation ($name: String!) {
            createProject(name: $name) {
                id
            }
        }
    `;

    item: InstanceAddForm;

    definition: GetDefinitionResponseDto;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        @Inject('repository.definition') private definitionRepository,
        private apollo: Apollo,
    ) {
        this.item = {
            definitionId: '',
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
                (params: Params) => this.definitionRepository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetDefinitionResponseDto) => {
                    this.definition = item;
                    this.item.definitionId = item.id;
                }
            );

    }

}
