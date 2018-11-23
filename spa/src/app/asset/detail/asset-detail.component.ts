import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
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
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getAsset();
    }

    protected getAsset() {
        this.spinner.show();

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
                this.spinner.hide();
            });
    }
}
