import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    DefinitionSourceFormElement,
    DefinitionAssetVolumeFormElement,
    DefinitionProxiedPortFormElement,
    DefinitionEnvVariableFormElement,
    DefinitionSummaryItemFormElement,
    DefinitionRecipeFormElement,
    ExecuteServiceCommandTaskFormElement,
    AfterBuildTaskFormElement,
    CopyAssetIntoContainerTaskFormElement,
    DefinitionSourceVolumeFormElement,
} from './../recipe-form/definition-recipe-form.model';
import { ToastrService } from 'ngx-toastr';
import { DefinitionRecipeYamlMapperService } from '../import-yaml/definition-recipe-yaml-mapper.service';

@Component({
    selector: 'app-definition-recipe-simplified-form',
    templateUrl: './definition-recipe-simplified-form.component.html',
    styles: [],
})
export class DefinitionRecipeSimplifiedFormComponent {
    @Input() recipe: DefinitionRecipeFormElement;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
        protected definitionRecipeYamlMapperService: DefinitionRecipeYamlMapperService,
    ) {}

    addSource(): void {
        this.recipe.sources.push({
            id: '',
            cloneUrl: '',
            useDeployKey: false,
            reference: {
                type: 'branch',
                name: '',
            },
            beforeBuildTasks: [],
        });
    }

    deleteSource(source: DefinitionSourceFormElement): void {
        const index = this.recipe.sources.indexOf(source);
        if (-1 !== index) {
            this.recipe.sources.splice(index, 1);
        }
    }

    addSourceVolume(): void {
        this.recipe.sourceVolumes.push({
            id: '',
            sourceId: '',
            relativePath: '',
        });
    }

    deleteSourceVolume(volume: DefinitionSourceVolumeFormElement): void {
        const index = this.recipe.sourceVolumes.indexOf(volume);
        if (-1 !== index) {
            this.recipe.sourceVolumes.splice(index, 1);
        }
    }

    addAssetVolume(): void {
        this.recipe.assetVolumes.push({
            id: '',
            assetId: '',
        });
    }

    deleteAssetVolume(volume: DefinitionAssetVolumeFormElement): void {
        const index = this.recipe.assetVolumes.indexOf(volume);
        if (-1 !== index) {
            this.recipe.assetVolumes.splice(index, 1);
        }
    }

    addProxiedPort(): void {
        this.recipe.proxiedPorts.push({
            serviceId: '',
            id: '',
            name: '',
            port: null,
            useDefaultNginxConfigTemplate: true,
            nginxConfigTemplate: this.definitionRecipeYamlMapperService
                .defaultNginxConfigTemplate,
        });
    }

    deleteProxiedPort(proxiedPort: DefinitionProxiedPortFormElement): void {
        const index = this.recipe.proxiedPorts.indexOf(proxiedPort);
        if (-1 !== index) {
            this.recipe.proxiedPorts.splice(index, 1);
        }
    }

    addEnvVariable(): void {
        this.recipe.envVariables.push({
            name: '',
            value: '',
        });
    }

    deleteEnvVariable(envVariable: DefinitionEnvVariableFormElement): void {
        const index = this.recipe.envVariables.indexOf(envVariable);
        if (-1 !== index) {
            this.recipe.envVariables.splice(index, 1);
        }
    }

    addAfterBuildTaskExecuteServiceCommand(): void {
        this.recipe.afterBuildTasks.push({
            type: 'execute_service_command',
            id: '',
            dependsOn: [],
            command: [''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as ExecuteServiceCommandTaskFormElement);
    }

    addAfterBuildTaskCopyAssetIntoContainer(): void {
        this.recipe.afterBuildTasks.push({
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
        const index = this.recipe.afterBuildTasks.indexOf(afterBuildTask);
        if (-1 !== index) {
            this.recipe.afterBuildTasks.splice(index, 1);
        }
    }

    addSummaryItem(): void {
        this.recipe.summaryItems.push({
            name: '',
            value: '',
        });
    }

    deleteSummaryItem(summaryItem: DefinitionSummaryItemFormElement): void {
        const index = this.recipe.summaryItems.indexOf(summaryItem);
        if (-1 !== index) {
            this.recipe.summaryItems.splice(index, 1);
        }
    }

    getAvailableEnvVariableNames(): string[] {
        const availableEnvVariableNames = [];
        for (const envVariable of this.recipe.envVariables) {
            availableEnvVariableNames.push(envVariable.name);
        }
        availableEnvVariableNames.push('FEATER__INSTANCE_ID');
        for (const proxiedPort of this.recipe.proxiedPorts) {
            availableEnvVariableNames.push(
                `FEATER__PROXY_DOMIAN__${proxiedPort.id.toUpperCase()}`,
            );
        }

        return availableEnvVariableNames;
    }
}
