import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getDeployKeyDetailQueryGql,
    GetDeployKeyDetailQueryInterface,
    GetDeployKeyDetailQueryDeployKeyFieldInterface,
} from './get-deploy-key-detail.query';


@Component({
    selector: 'app-deploy-key-detail',
    templateUrl: './deploy-key-detail.component.html',
    styles: []
})
export class DeployKeyDetailComponent implements OnInit {

    deployKey: GetDeployKeyDetailQueryDeployKeyFieldInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getDeployKey();
    }

    goToList() {
        this.router.navigate(['/deployKeys']);
    }

    regenerate() {
        console.log('TODO::DeployKeyDetailComponent regenerate', this.deployKey); // TODO
    }

    private getDeployKey() {
        return this.apollo
            .watchQuery<GetDeployKeyDetailQueryInterface>({
                query: getDeployKeyDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDeployKeyDetailQueryInterface = result.data;
                this.deployKey = resultData.deployKey;
            });
    }
}
