import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-after-build-task-execute-service-command-form-element',
    templateUrl: './definition-add.after-build-task-execute-service-command-form-element.component.html',
    styles: []
})
export class DefinitionAddAfterBuildTaskExecuteServiceCommandFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement;

    @Input() availableEnvVariableNames: string[];

    @Output() deleteItem: EventEmitter<DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement> =
        new EventEmitter<DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement>();

    ngOnInit() {}

    onDeleteItem(): void {
        this.deleteItem.emit(this.item);
    }

    addInheritedEnvVariableItem(): void {
        this.item.inheritedEnvVariables.push({
            name: '',
            alias: '',
        });
    }

    deleteInheritedEnvVariableItem(inheritedEnvVariable): void {
        const index = this.item.inheritedEnvVariables.indexOf(inheritedEnvVariable);
        if (-1 !== index) {
            this.item.inheritedEnvVariables.splice(index, 1);
        }
    }

    addCustomEnvVariableItem() {
        this.item.customEnvVariables.push({
            name: '',
            value: '',
        });
    }

    deleteCustomEnvVariableItem(customEnvVariable): void {
        const index = this.item.customEnvVariables.indexOf(customEnvVariable);
        if (-1 !== index) {
            this.item.customEnvVariables.splice(index, 1);
        }
    }

}
