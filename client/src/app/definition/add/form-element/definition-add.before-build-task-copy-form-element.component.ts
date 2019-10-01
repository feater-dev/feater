import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskFormElement } from '../../recipe-form/definition-recipe-form.model';

@Component({
    selector: 'app-definition-add-before-build-task-copy-form-element',
    templateUrl:
        './definition-add.before-build-task-copy-form-element.component.html',
    styles: [],
})
export class DefinitionAddBeforeBuildTaskCopyFormElementComponent {
    @Input() task: TaskFormElement;

    @Output() deleteTask: EventEmitter<TaskFormElement> = new EventEmitter<
        TaskFormElement
    >();

    delete(): void {
        this.deleteTask.emit(this.task);
    }
}
