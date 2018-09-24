import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getDeployKeyListQueryGql,
    GetDeployKeyListQueryInterface,
    GetDeployKeyListQueryDeployKeysFieldItemInterface,
} from './get-deploy-key-list.query';

@Component({
    selector: 'app-deploy-key-list',
    templateUrl: './deploy-key-list.component.html',
    styles: []
})
export class DeployKeyListComponent implements OnInit {

    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];

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
