import {Component, OnInit, Inject} from '@angular/core';
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
        mutation ($sshCloneUrl: String!) {
            regenerateDeployKey(sshCloneUrl: $sshCloneUrl) {
                sshCloneUrl
            }
        }
    `;

    protected readonly removeDeployKeyMutation = gql`
        mutation ($sshCloneUrl: String!) {
            removeDeployKey(sshCloneUrl: $sshCloneUrl) {
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
            variables: {sshCloneUrl: this.item.sshCloneUrl},
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
            variables: {sshCloneUrl: this.item.sshCloneUrl},
            refetchQueries: [{
                query: getDeployKeyListQueryGql,
            }],
        }).subscribe(
            () => { this.goToList(); },
            (error) => { console.log(error); }
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
                console.log('subscribe');
                const resultData: GetDeployKeyDetailQueryInterface = result.data;
                console.log(resultData.deployKey.fingerprint);
                this.item = resultData.deployKey;
            });
    }

    protected goToList() {
        this.router.navigate(['/deploy-keys']);
    }
}
