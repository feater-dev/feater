import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InterpolateTaskFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-before-build-task-interpolate-form-element',
    templateUrl:
        './definition-add.before-build-task-interpolate-form-element.component.html',
    styles: [],
})
export class DefinitionAddBeforeBuildTaskInterpolateFormElementComponent {
    @Input() task: InterpolateTaskFormElement;

    @Output() deleteTask: EventEmitter<
        InterpolateTaskFormElement
    > = new EventEmitter<InterpolateTaskFormElement>();

    delete(): void {
        this.deleteTask.emit(this.task);
    }
}
