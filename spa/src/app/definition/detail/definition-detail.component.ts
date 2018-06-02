import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

interface Definition {
    id: string;
    project: {
        id: string;
        name: string;
    };
    name: string;
    config: any;
}

interface Query {
    definition: Definition;
}

@Component({
    selector: 'app-definition-detail',
    templateUrl: './definition-detail.component.html',
    styles: []
})
export class DefinitionDetailComponent implements OnInit {

    item: Definition;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.definition') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/definitions']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.project.id]);
    }

    goToAddInstance() {
        this.router.navigate(['/definition', this.item.id, 'instance', 'add']);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<Query>({
                            query: gql`query ($id: String!) {
                                definition(id: $id) {
                                    id
                                    project {
                                        id
                                        name
                                    }
                                    name
                                    config {
                                        sources {
                                            id
                                            type
                                            name
                                            reference {
                                                type
                                                name
                                            }
                                        }
                                        proxiedPorts {
                                            id
                                            serviceId
                                            name
                                            port
                                        }
                                        composeFiles {
                                            sourceId
                                            envDirRelativePath
                                            composeFileRelativePaths
                                        }
                                        summaryItems {
                                            name
                                            text
                                        }
                                        environmentalVariables {
                                            name
                                            value
                                        }
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
                                console.log(result);

                                return result.data.definition;
                            })
                        );
                }
            ))
            .subscribe(
                (item: Definition) => {
                    this.item = item;
                },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}

// beforeBuildTasks {
//     ... on CopyBeforeBuildTask {
//             type
//                 sourceRelativePath
//             destinationRelativePath
//         }
//     ... on InterpolateBeforeBuildTask {
//             type
//                 relativePath
//         }
// }
