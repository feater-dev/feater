import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {MappedInstance} from '../instance.model';
import {GetInstanceResponseDto} from '../instance-response-dtos.model';

import {map} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';


interface Instance {
    readonly id: string;
    readonly definition: {
        readonly id: string;
        readonly name: string;
        readonly project: {
            readonly id: string;
            readonly name: string;
        };
    };
    readonly hash: string;
    readonly name: string;
    readonly services: any;
    readonly summaryItems: {
        readonly name: string;
        readonly text: string;
    }[];
    readonly envVariables: {
        readonly name: string;
        readonly value: string;
    }[];
    readonly proxiedPorts: {
        readonly id: string;
        readonly serviceId: string;
        readonly name: string;
        readonly port: number;
        readonly proxyDomain: string;
    }[];
}

interface Query {
    instance: Instance;
}

@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styles: []
})
export class InstanceDetailComponent implements OnInit {

    item: Instance;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.definition.project.id]);
    }

    goToDefinitionDetails() {
        this.router.navigate(['/definition', this.item.definition.id]);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<Query>({
                            query: gql`query ($id: String!) {
                                instance(id: $id) {
                                    id
                                    name
                                    definition {
                                        id
                                        name
                                        project {
                                            id
                                            name
                                        }
                                    }
                                    services {
                                        id
                                        cleanId
                                        containerId
                                        containerNamePrefix
                                        ipAddress
                                    }
                                    proxiedPorts {
                                        serviceId
                                        id
                                        name
                                        port
                                        proxyDomain
                                    }
                                    summaryItems {
                                        name
                                        text
                                    }
                                    envVariables {
                                        name
                                        value
                                    }
                                }
                            }`,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.instance;
                            })
                        );
                }
            ))
            .subscribe(
                (item: Instance) => {
                    this.item = item;
                },
                (error) => { this.errorMessage = <any>error; }
            );
    }

    private mapItem(item: GetInstanceResponseDto): MappedInstance {
        return {
            id: item.id,
            name: item.name,
            definition: item.definition,
            envVariables: item.envVariables,
            summaryItems: item.summaryItems
        } as MappedInstance;
    }

}
