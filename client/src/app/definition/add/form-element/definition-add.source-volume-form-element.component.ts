import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DefinitionSourceVolumeFormElement } from '../../recipe-form/definition-recipe-form.model';

@Component({
    selector: 'app-definition-add-source-volume-form-element',
    templateUrl: './definition-add.source-volume-form-element.component.html',
    styles: [],
})
export class DefinitionAddSourceVolumeFormElementComponent {
    @Input() sourceVolume: DefinitionSourceVolumeFormElement;

    @Output() deleteItem: EventEmitter<
        DefinitionSourceVolumeFormElement
    > = new EventEmitter<DefinitionSourceVolumeFormElement>();

    delete(): void {
        this.deleteItem.emit(this.sourceVolume);
    }
}
