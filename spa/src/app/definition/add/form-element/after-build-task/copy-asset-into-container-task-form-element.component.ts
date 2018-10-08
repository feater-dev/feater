import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CopyAssetIntoContainerTaskFormElement} from '../../definition-add-form.model';


@Component({
    selector: 'app-copy-asset-into-container-task-form-element',
    templateUrl: './copy-asset-into-container-task-form-element.component.html',
    styles: []
})
export class CopyAssetIntoContainerTaskFormElementComponent {

    @Input() item: CopyAssetIntoContainerTaskFormElement;

    @Output() deleteItem: EventEmitter<CopyAssetIntoContainerTaskFormElement> =
        new EventEmitter<CopyAssetIntoContainerTaskFormElement>();

    delete(): void {
        this.deleteItem.emit(this.item);
    }

}
