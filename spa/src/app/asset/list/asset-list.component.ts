import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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
