import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getDeployKeyListQueryGql,
    GetDeployKeyListQueryInterface,
    GetDeployKeyListQueryDeployKeysFieldItemInterface,
} from './get-deploy-key-list.query';
import {getDeployKeyDetailQueryGql} from '../detail/get-deploy-key-detail.query';
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

    items: GetDeployKeyListQueryDeployKeysFieldItemInterface[];

    constructor(
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getDeployKeys();
    }

    goToDetail(deployKey: GetDeployKeyListQueryDeployKeysFieldItemInterface) {
        this.router.navigate(['/deploy-key', deployKey.id]);
    }

    generateMissingItems() {
        this.apollo.mutate({
            mutation: this.generateMissingDeployKeysMutation,
            refetchQueries: [{query: getDeployKeyListQueryGql}],
        }).subscribe(
            () => {},
            (error) => { console.log(error); }
        );
    }

    removeUnusedItems() {
        this.apollo.mutate({
            mutation: this.removeUnusedDeployKeysMutation,
            refetchQueries: [{query: getDeployKeyListQueryGql}],
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
                this.items = resultData.deployKeys;
            });
    }
}
