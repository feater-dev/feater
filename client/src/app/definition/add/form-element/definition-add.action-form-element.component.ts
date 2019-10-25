import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    ActionFormElement,
    AfterBuildTaskFormElement,
    CopyAssetIntoContainerTaskFormElement,
    ExecuteServiceCommandTaskFormElement,
} from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-action-form-element',
    templateUrl: './definition-add.action-form-element.component.html',
    styles: [],
})
export class DefinitionAddActionFormElementComponent {
    @Input() item: ActionFormElement;

    @Input() availableEnvVariableNames: string[];

    @Output() deleteItem: EventEmitter<ActionFormElement> = new EventEmitter<
        ActionFormElement
    >();

    delete() {
        this.deleteItem.emit(this.item);
    }

    addAfterBuildTaskExecuteServiceCommand(): void {
        this.item.afterBuildTasks.push({
            type: 'execute_service_command',
            id: '',
            dependsOn: [],
            command: [''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as ExecuteServiceCommandTaskFormElement);
    }

    addAfterBuildTaskCopyAssetIntoContainer(): void {
        this.item.afterBuildTasks.push({
            type: 'copy_asset_into_container',
            id: '',
            dependsOn: [],
            serviceId: '',
            assetId: '',
            destinationPath: '',
        } as CopyAssetIntoContainerTaskFormElement);
    }

    isAfterBuildTaskExecuteServiceCommand(
        afterBuildTask: AfterBuildTaskFormElement,
    ): boolean {
        return 'execute_service_command' === afterBuildTask.type;
    }

    isAfterBuildTaskCopyAssetIntoContainer(
        afterBuildTask: AfterBuildTaskFormElement,
    ): boolean {
        return 'copy_asset_into_container' === afterBuildTask.type;
    }

    deleteAfterBuildTask(afterBuildTask: AfterBuildTaskFormElement): void {
        const index = this.item.afterBuildTasks.indexOf(afterBuildTask);
        if (-1 !== index) {
            this.item.afterBuildTasks.splice(index, 1);
        }
    }

    getAvailableEnvVariableNames(): string[] {
        // TODO Update.
        const availableEnvVariableNames = [];
        // for (const envVariable of this.item.envVariables) {
        //     availableEnvVariableNames.push(envVariable.name);
        // }
        availableEnvVariableNames.push('FEATER__INSTANCE_ID');
        // for (const proxiedPort of this.item.proxiedPorts) {
        //     availableEnvVariableNames.push(`FEATER__PROXY_DOMIAN__${proxiedPort.id.toUpperCase()}`);
        // }

        return availableEnvVariableNames;
    }
}
