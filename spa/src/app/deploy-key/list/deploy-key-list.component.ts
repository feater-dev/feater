import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
    getDeployKeyListQueryGql,
    GetDeployKeyListQueryInterface,
    GetDeployKeyListQueryDeployKeysFieldItemInterface,
} from './get-deploy-key-list.query';
import gql from 'graphql-tag';

@Component({
    selector: 'app-deploy-key-list',
    templateUrl: './deploy-key-list.component.html',
    styles: []
})
export class DeployKeyListComponent implements OnInit {

    protected readonly generateMissingDeployKeysMutation = gql`
        mutation {
            generateMissingDeployKeys {
                generated
            }
        }
    `;

    protected readonly removeUnusedDeployKeysMutation = gql`
        mutation {
            removeUnusedDeployKeys {
                removed
            }
        }
    `;

    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.getDeployKeys();
    }

    generateMissingItems() {
        this.apollo.mutate({
            mutation: this.generateMissingDeployKeysMutation,
            refetchQueries: [{
                query: getDeployKeyListQueryGql,
            }],
        }).subscribe(
            () => {},
            (error) => { console.log(error); }
        );
    }

    removeUnusedItems() {
        this.apollo.mutate({
            mutation: this.removeUnusedDeployKeysMutation,
            refetchQueries: [{
                query: getDeployKeyListQueryGql,
            }],
        }).subscribe(
            () => {},
            (error) => { console.log(error); }
        );
    }

    private getDeployKeys() {
        this.apollo
            .watchQuery<GetDeployKeyListQueryInterface>({
                query: getDeployKeyListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDeployKeyListQueryInterface = result.data;
                this.deployKeys = resultData.deployKeys;
            });
    }
}
