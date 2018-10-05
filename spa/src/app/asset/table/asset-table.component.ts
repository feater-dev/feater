import {Component, Input} from '@angular/core';
import {GetAssetListQueryAssetsFieldItemInterface} from '../list/get-asset-list.query';


@Component({
    selector: 'app-asset-table',
    templateUrl: './asset-table.component.html',
    styles: []
})
export class AssetTableComponent {

    @Input() assets: GetAssetListQueryAssetsFieldItemInterface[];

}
