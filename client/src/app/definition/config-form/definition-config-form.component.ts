import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    DefinitionSourceFormElement,
    DefinitionVolumeFormElement,
    DefinitionProxiedPortFormElement,
    DefinitionEnvVariableFormElement,
    DefinitionSummaryItemFormElement,
    DefinitionConfigFormElement,
    ExecuteServiceCommandTaskFormElement,
    AfterBuildTaskFormElement,
    CopyAssetIntoContainerTaskFormElement,
} from './definition-config-form.model';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'app-definition-config-form',
    templateUrl: './definition-config-form.component.html',
    styles: []
})
export class DefinitionConfigFormComponent {

    @Input() config: DefinitionConfigFormElement;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
    ) {
    }

    addSource(): void {
        this.config.sources.push({
            id: '',
            cloneUrl: '',
            useDeployKey: false,
            reference: {
                type: 'branch',
                name: ''
            },
            beforeBuildTasks: []
        });
    }

    deleteSource(source: DefinitionSourceFormElement): void {
        const index = this.config.sources.indexOf(source);
        if (-1 !== index) {
            this.config.sources.splice(index, 1);
        }
    }

    addVolume(): void {
        this.config.volumes.push({
            id: '',
            assetId: '',
        });
    }

    deleteVolume(volume: DefinitionVolumeFormElement): void {
        const index = this.config.volumes.indexOf(volume);
        if (-1 !== index) {
            this.config.volumes.splice(index, 1);
        }
    }

    addProxiedPort(): void {
        this.config.proxiedPorts.push({
            serviceId: '',
            id: '',
            name: '',
            port: null,
        });
    }

    deleteProxiedPort(proxiedPort: DefinitionProxiedPortFormElement): void {
        const index = this.config.proxiedPorts.indexOf(proxiedPort);
        if (-1 !== index) {
            this.config.proxiedPorts.splice(index, 1);
        }
    }

    addEnvVariable(): void {
        this.config.envVariables.push({
            name: '',
            value: ''
        });
    }

    deleteEnvVariable(envVariable: DefinitionEnvVariableFormElement): void {
        const index = this.config.envVariables.indexOf(envVariable);
        if (-1 !== index) {
            this.config.envVariables.splice(index, 1);
        }
    }

    addAfterBuildTaskExecuteServiceCommand(): void {
        this.config.afterBuildTasks.push({
            type: 'executeServiceCommand',
            id: '',
            dependsOn: [],
            command: [''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as ExecuteServiceCommandTaskFormElement);
    }

    addAfterBuildTaskCopyAssetIntoContainer(): void {
        this.config.afterBuildTasks.push({
            type: 'copyAssetIntoContainer',
            id: '',
            dependsOn: [],
            serviceId: '',
            assetId: '',
            destinationPath: '',
        } as CopyAssetIntoContainerTaskFormElement);
    }

    isAfterBuildTaskExecuteServiceCommand(afterBuildTask: AfterBuildTaskFormElement): boolean {
        return 'executeServiceCommand' === afterBuildTask.type;
    }

    isAfterBuildTaskCopyAssetIntoContainer(afterBuildTask: AfterBuildTaskFormElement): boolean {
        return 'copyAssetIntoContainer' === afterBuildTask.type;
    }

    deleteAfterBuildTask(afterBuildTask: AfterBuildTaskFormElement): void {
        const index = this.config.afterBuildTasks.indexOf(afterBuildTask);
        if (-1 !== index) {
            this.config.afterBuildTasks.splice(index, 1);
        }
    }

    addSummaryItem(): void {
        this.config.summaryItems.push({
            name: '',
            value: ''
        });
    }

    deleteSummaryItem(summaryItem: DefinitionSummaryItemFormElement): void {
        const index = this.config.summaryItems.indexOf(summaryItem);
        if (-1 !== index) {
            this.config.summaryItems.splice(index, 1);
        }
    }

    getAvailableEnvVariableNames(): string[] {
        const availableEnvVariableNames = [];
        for (const envVariable of this.config.envVariables) {
            availableEnvVariableNames.push(envVariable.name);
        }
        availableEnvVariableNames.push('FEATER__INSTANCE_ID');
        for (const proxiedPort of this.config.proxiedPorts) {
            availableEnvVariableNames.push(`FEATER__PROXY_DOMIAN__${proxiedPort.id.toUpperCase()}`);
        }

        return availableEnvVariableNames;
    }

}
