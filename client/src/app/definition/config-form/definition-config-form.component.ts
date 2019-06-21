import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    DefinitionSourceFormElement,
    DefinitionAssetVolumeFormElement,
    DefinitionProxiedPortFormElement,
    DefinitionEnvVariableFormElement,
    DefinitionSummaryItemFormElement,
    DefinitionConfigFormElement,
    ExecuteServiceCommandTaskFormElement,
    AfterBuildTaskFormElement,
    CopyAssetIntoContainerTaskFormElement, DefinitionSourceVolumeFormElement,
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

    addSourceVolume(): void {
        this.config.sourceVolumes.push({
            id: '',
            sourceId: '',
            relativePath: '',
        });
    }

    deleteSourceVolume(volume: DefinitionSourceVolumeFormElement): void {
        const index = this.config.sourceVolumes.indexOf(volume);
        if (-1 !== index) {
            this.config.sourceVolumes.splice(index, 1);
        }
    }

    addAssetVolume(): void {
        this.config.assetVolumes.push({
            id: '',
            assetId: '',
        });
    }

    deleteAssetVolume(volume: DefinitionAssetVolumeFormElement): void {
        const index = this.config.assetVolumes.indexOf(volume);
        if (-1 !== index) {
            this.config.assetVolumes.splice(index, 1);
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
            type: 'execute_service_command',
            id: '',
            dependsOn: [],
            command: [''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as ExecuteServiceCommandTaskFormElement);
    }

    addAfterBuildTaskCopyAssetIntoContainer(): void {
        this.config.afterBuildTasks.push({
            type: 'copy_asset_into_container',
            id: '',
            dependsOn: [],
            serviceId: '',
            assetId: '',
            destinationPath: '',
        } as CopyAssetIntoContainerTaskFormElement);
    }

    isAfterBuildTaskExecuteServiceCommand(afterBuildTask: AfterBuildTaskFormElement): boolean {
        return 'execute_service_command' === afterBuildTask.type;
    }

    isAfterBuildTaskCopyAssetIntoContainer(afterBuildTask: AfterBuildTaskFormElement): boolean {
        return 'copy_asset_into_container' === afterBuildTask.type;
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
