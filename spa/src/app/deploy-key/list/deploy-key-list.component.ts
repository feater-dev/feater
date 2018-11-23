import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
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

    constructor(
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

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

    protected getDeployKeys() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetDeployKeyListQueryInterface>({
                query: getDeployKeyListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDeployKeyListQueryInterface = result.data;
                this.deployKeys = resultData.deployKeys;
                this.spinner.hide();
            });
    }
}
