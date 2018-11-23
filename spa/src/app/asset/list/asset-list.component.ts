import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
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
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getAssets();
    }

    protected getAssets() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetAssetListQueryInterface>({
                query: getAssetListQueryGql,
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetAssetListQueryInterface = result.data;
                this.assets = resultData.assets;
                this.spinner.hide();
            });
    }
}
