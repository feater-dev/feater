import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DefinitionAssetVolumeFormElement } from '../../recipe-form/definition-recipe-form.model';

@Component({
    selector: 'app-definition-add-asset-volume-form-element',
    templateUrl: './definition-add.asset-volume-form-element.component.html',
    styles: [],
})
export class DefinitionAddAssetVolumeFormElementComponent {
    @Input() assetVolume: DefinitionAssetVolumeFormElement;

    @Output() deleteItem: EventEmitter<
        DefinitionAssetVolumeFormElement
    > = new EventEmitter<DefinitionAssetVolumeFormElement>();

    delete(): void {
        this.deleteItem.emit(this.assetVolume);
    }
}
