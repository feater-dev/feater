import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    SourceFormElement,
    AssetVolumeFormElement,
    ProxiedPortFormElement,
    EnvVariableFormElement,
    RecipeFormElement,
    ActionFormElement,
    SummaryItemFormElement,
    DownloadableFormElement,
} from './recipe-form.model';
import { ToastrService } from 'ngx-toastr';
import { RecipeYamlMapperService } from '../import-yaml/recipe-yaml-mapper.service';

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styles: [],
})
export class RecipeFormComponent {
    @Input() recipe: RecipeFormElement;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
        protected definitionRecipeYamlMapperService: RecipeYamlMapperService,
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

    deleteSource(source: SourceFormElement): void {
        const index = this.recipe.sources.indexOf(source);
        if (-1 !== index) {
            this.recipe.sources.splice(index, 1);
        }
    }

    addAssetVolume(): void {
        this.recipe.assetVolumes.push({
            id: '',
            assetId: '',
        });
    }

    deleteAssetVolume(volume: AssetVolumeFormElement): void {
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

    deleteProxiedPort(proxiedPort: ProxiedPortFormElement): void {
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

    deleteEnvVariable(envVariable: EnvVariableFormElement): void {
        const index = this.recipe.envVariables.indexOf(envVariable);
        if (-1 !== index) {
            this.recipe.envVariables.splice(index, 1);
        }
    }

    addAction(): void {
        this.recipe.actions.push({
            id: '',
            type: 'modification',
            name: '',
            afterBuildTasks: [],
        });
    }

    deleteAction(action: ActionFormElement): void {
        const index = this.recipe.actions.indexOf(action);
        if (-1 !== index) {
            this.recipe.actions.splice(index, 1);
        }
    }

    addSummaryItem(): void {
        this.recipe.summaryItems.push({
            name: '',
            value: '',
        });
    }

    deleteSummaryItem(summaryItem: SummaryItemFormElement): void {
        const index = this.recipe.summaryItems.indexOf(summaryItem);
        if (-1 !== index) {
            this.recipe.summaryItems.splice(index, 1);
        }
    }

    addDownloadable(): void {
        this.recipe.downloadables.push({
            id: '',
            name: '',
            serviceId: '',
            absolutePath: '',
        });
    }

    deleteDownloadable(downloadable: DownloadableFormElement): void {
        const index = this.recipe.downloadables.indexOf(downloadable);
        if (-1 !== index) {
            this.recipe.downloadables.splice(index, 1);
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
