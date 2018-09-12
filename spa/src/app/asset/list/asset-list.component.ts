import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    getAssetListQueryGql,
    GetAssetListQueryInterface,
    GetAssetListQueryAssetsFieldItemInterface,
} from './get-asset-list.query';


@Component({
    selector: 'app-asset-list',
    templateUrl: './asset-list.component.html',
    styles: []
})
export class AssetListComponent implements OnInit {

    assets: GetAssetListQueryAssetsFieldItemInterface[];

    constructor(
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getAssets();
    }

    goToDetail(asset) {
        this.router.navigate(['/asset', asset.id]);
    }

    goToAdd() {
        this.router.navigate(['/asset/add']);
    }

    private getAssets() {
        this.apollo
            .watchQuery<GetAssetListQueryInterface>({
                query: getAssetListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetAssetListQueryInterface = result.data;
                this.assets = resultData.assets;
            });
    }
}
