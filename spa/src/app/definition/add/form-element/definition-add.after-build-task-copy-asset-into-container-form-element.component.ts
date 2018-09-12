import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionAddFormAfterBuildCopyAssetIntoContainerTaskFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-after-build-task-copy-asset-into-container-form-element',
    templateUrl: './definition-add.after-build-task-copy-asset-into-container-form-element.component.html',
    styles: []
})
export class DefinitionAddAfterBuildTaskCopyAssetIntoContainerFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormAfterBuildCopyAssetIntoContainerTaskFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormAfterBuildCopyAssetIntoContainerTaskFormElement> =
        new EventEmitter<DefinitionAddFormAfterBuildCopyAssetIntoContainerTaskFormElement>();

    ngOnInit() {}

    onDeleteItem(): void {
        this.deleteItem.emit(this.item);
    }

}
