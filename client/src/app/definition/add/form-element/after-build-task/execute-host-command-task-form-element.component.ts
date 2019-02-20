import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ExecuteHostCommandTaskFormElement} from '../../definition-add-form.model';


@Component({
    selector: 'app-execute-host-command-task-form-element',
    templateUrl: './execute-host-command-task-form-element.component.html',
    styles: []
})
export class ExecuteHostCommandTaskFormElementComponent {

    @Input() item: ExecuteHostCommandTaskFormElement;

    @Input() availableEnvVariableNames: string[];

    @Output() deleteItem: EventEmitter<ExecuteHostCommandTaskFormElement> =
        new EventEmitter<ExecuteHostCommandTaskFormElement>();

    delete(): void {
        this.deleteItem.emit(this.item);
    }

    addArgument(): void {
        this.item.command.push('');
    }

    deleteArgument(i: number) {
        this.item.command.splice(i, 1);
    }

    addDependsOn(): void {
        this.item.dependsOn.push('');
    }

    deleteDependsOn(i: number) {
        this.item.dependsOn.splice(i, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

}
