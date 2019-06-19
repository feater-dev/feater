import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionAssetVolumeFormElement} from '../../config-form/definition-config-form.model';


@Component({
    selector: 'app-definition-add-asset-volume-form-element',
    templateUrl: './definition-add.asset-volume-form-element.component.html',
    styles: []
})
export class DefinitionAddAssetVolumeFormElementComponent implements OnInit {

    @Input() assetVolume: DefinitionAssetVolumeFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAssetVolumeFormElement> =
        new EventEmitter<DefinitionAssetVolumeFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteItem.emit(this.assetVolume);
    }

}
