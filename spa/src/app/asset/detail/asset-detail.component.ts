import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getAssetDetailQueryGql,
    GetAssetDetailQueryInterface,
    GetAssetDetailQueryAssetFieldInterface,
} from './get-asset-detail.query';


@Component({
    selector: 'app-asset-detail',
    templateUrl: './asset-detail.component.html',
    styles: []
})
export class AssetDetailComponent implements OnInit {

    asset: GetAssetDetailQueryAssetFieldInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getAsset();
    }

    goToProjectDetails(id: string) {
        this.router.navigate(['/project', id]);
    }

    private getAsset() {
        return this.apollo
            .watchQuery<GetAssetDetailQueryInterface>({
                query: getAssetDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetAssetDetailQueryInterface = result.data;
                this.asset = resultData.asset;
            });
    }
}
