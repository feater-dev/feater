import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CopyAssetIntoContainerTaskFormElement } from '../../../recipe-form/definition-recipe-form.model';

@Component({
    selector: 'app-copy-asset-into-container-task-form-element',
    templateUrl: './copy-asset-into-container-task-form-element.component.html',
    styles: [],
})
export class CopyAssetIntoContainerTaskFormElementComponent {
    @Input() task: CopyAssetIntoContainerTaskFormElement;

    @Output() deleteTask: EventEmitter<
        CopyAssetIntoContainerTaskFormElement
    > = new EventEmitter<CopyAssetIntoContainerTaskFormElement>();

    addDependsOn(): void {
        this.task.dependsOn.push('');
    }

    deleteDependsOn(i: number) {
        this.task.dependsOn.splice(i, 1);
    }

    delete(): void {
        this.deleteTask.emit(this.task);
    }
}
