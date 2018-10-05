import {Component, Input} from '@angular/core';
import {GetDeployKeyListQueryDeployKeysFieldItemInterface} from '../list/get-deploy-key-list.query';

@Component({
    selector: 'app-deploy-key-table',
    templateUrl: './deploy-key-table.component.html',
    styles: []
})
export class DeployKeyTableComponent {

    @Input() deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];

}
