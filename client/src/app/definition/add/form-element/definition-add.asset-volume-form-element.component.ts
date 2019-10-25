import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AssetVolumeFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-asset-volume-form-element',
    templateUrl: './definition-add.asset-volume-form-element.component.html',
    styles: [],
})
export class DefinitionAddAssetVolumeFormElementComponent {
    @Input() assetVolume: AssetVolumeFormElement;

    @Output() deleteItem: EventEmitter<
        AssetVolumeFormElement
    > = new EventEmitter<AssetVolumeFormElement>();

    delete(): void {
        this.deleteItem.emit(this.assetVolume);
    }
}
