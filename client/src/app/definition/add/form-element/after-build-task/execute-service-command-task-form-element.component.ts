import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ExecuteServiceCommandTaskFormElement } from '../../../recipe-form/definition-recipe-form.model';

@Component({
    selector: 'app-execute-service-command-task-form-element',
    templateUrl: './execute-service-command-task-form-element.component.html',
    styles: [],
})
export class ExecuteServiceCommandTaskFormElementComponent {
    @Input() task: ExecuteServiceCommandTaskFormElement;

    @Input() availableEnvVariableNames: string[];

    @Output() deleteTask: EventEmitter<
        ExecuteServiceCommandTaskFormElement
    > = new EventEmitter<ExecuteServiceCommandTaskFormElement>();

    delete(): void {
        this.deleteTask.emit(this.task);
    }

    addArgument(): void {
        this.task.command.push('');
    }

    deleteArgument(i: number) {
        this.task.command.splice(i, 1);
    }

    addDependsOn(): void {
        this.task.dependsOn.push('');
    }

    deleteDependsOn(i: number) {
        this.task.dependsOn.splice(i, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
