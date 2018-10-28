import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getDeployKeyDetailQueryGql,
    GetDeployKeyDetailQueryInterface,
    GetDeployKeyDetailQueryDeployKeyFieldInterface,
} from './get-deploy-key-detail.query';
import gql from 'graphql-tag';
import {getDeployKeyListQueryGql} from '../list/get-deploy-key-list.query';


@Component({
    selector: 'app-deploy-key-detail',
    templateUrl: './deploy-key-detail.component.html',
    styles: []
})
export class DeployKeyDetailComponent implements OnInit {

    protected readonly regenerateDeployKeyMutation = gql`
        mutation ($cloneUrl: String!) {
            regenerateDeployKey(cloneUrl: $cloneUrl) {
                cloneUrl
            }
        }
    `;

    protected readonly removeDeployKeyMutation = gql`
        mutation ($cloneUrl: String!) {
            removeDeployKey(cloneUrl: $cloneUrl) {
                removed
            }
        }
    `;

    item: GetDeployKeyDetailQueryDeployKeyFieldInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getDeployKey();
    }

    regenerateItem() {
        this.apollo.mutate({
            mutation: this.regenerateDeployKeyMutation,
            variables: {cloneUrl: this.item.cloneUrl},
            refetchQueries: [{
                query: getDeployKeyDetailQueryGql,
                variables: {id: this.route.snapshot.params['id']},
            }],
        }).subscribe(
            () => {},
            (error) => { console.log(error); }
        );
    }

    removeItem() {
        this.apollo.mutate({
            mutation: this.removeDeployKeyMutation,
            variables: {cloneUrl: this.item.cloneUrl},
            refetchQueries: [{
                query: getDeployKeyListQueryGql,
            }],
        }).subscribe(
            () => {
                this.router.navigate(['/deploy-keys']);
            },
            (error) => {
                console.log(error);
            },
        );
    }

    protected getDeployKey() {
        return this.apollo
            .watchQuery<GetDeployKeyDetailQueryInterface>({
                query: getDeployKeyDetailQueryGql,
                variables: {id: this.route.snapshot.params['id']},
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDeployKeyDetailQueryInterface = result.data;
                this.item = resultData.deployKey;
            });
    }

}
