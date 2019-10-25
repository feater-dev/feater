import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    RecipeFormElement,
    ExecuteServiceCommandTaskFormElement,
} from '../recipe-form/recipe-form.model';
import {
    getProjectQueryGql,
    GetProjectQueryInterface,
    GetProjectQueryProjectFieldInterface,
} from './get-project.query';
import { ToastrService } from 'ngx-toastr';
import { RecipeYamlMapperService } from '../import-yaml/recipe-yaml-mapper.service';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as jsYaml from 'js-yaml';
import * as snakeCaseKeys from 'snakecase-keys';

interface DefinitionAddForm {
    name: string;
    recipe: RecipeFormElement;
}

export enum DefinitionRecipeInputModes {
    fullForm,
    simplifiedForm,
    rawYaml,
}

@Component({
    selector: 'app-definition-add',
    templateUrl: './definition-add.component.html',
    styles: [],
})
export class DefinitionAddComponent implements OnInit {
    // TODO Change to enum.
    static readonly actionAdd = 'add';

    definitionRecipeInputModes = DefinitionRecipeInputModes;

    definition: DefinitionAddForm;

    project: GetProjectQueryProjectFieldInterface;

    action = DefinitionAddComponent.actionAdd;

    recipeInputMode = DefinitionRecipeInputModes.fullForm;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
        protected definitionRecipeYamlMapperComponent: RecipeYamlMapperService,
    ) {
        this.definition = {
            name: '',
            recipe: {
                sources: [],
                assetVolumes: [],
                proxiedPorts: [],
                envVariables: [],
                composeFile: {
                    sourceId: '',
                    envDirRelativePath: '',
                    composeFileRelativePaths: [''],
                },
                actions: [],
                summaryItems: [],
                downloadables: [],
            },
        };
    }

    ngOnInit() {
        this.getProject();
    }

    createDefinition(): void {
        this.spinner.show();
        this.apollo
            .mutate({
                mutation: gql`
                    ${this.getCreateDefinitionMutation()}
                `,
            })
            .subscribe(
                ({ data }) => {
                    this.spinner.hide();
                    this.toastr.success(
                        `Definition <em>${data.createDefinition.name}</em> created.`,
                    );
                    this.router.navigate([
                        '/definition',
                        data.createDefinition.id,
                    ]);
                },
                () => {
                    this.spinner.hide();
                    this.toastr.error(
                        `Failed to create definition <em>${this.definition.name}</em>.`,
                    );
                },
            );
    }

    switchMode(mode: DefinitionRecipeInputModes): void {
        this.recipeInputMode = mode;
    }

    isRecipeInputModeFullForm(): boolean {
        return DefinitionRecipeInputModes.fullForm === this.recipeInputMode;
    }

    isRecipeInputModeSimplifiedForm(): boolean {
        return (
            DefinitionRecipeInputModes.simplifiedForm === this.recipeInputMode
        );
    }

    isRecipeInputModeRawYaml(): boolean {
        return DefinitionRecipeInputModes.rawYaml === this.recipeInputMode;
    }

    importRecipeYaml(recipe: RecipeFormElement): void {
        this.definition.recipe = recipe;
        this.switchMode(this.definitionRecipeInputModes.fullForm);
    }

    protected mapDefinitionToDto(): any {
        const recipe = {
            schemaVersion: '0.1',
            sources: this.definition.recipe.sources,
            assetVolumes: this.definition.recipe.assetVolumes,
            proxiedPorts: this.definition.recipe.proxiedPorts.map(
                proxiedPort => {
                    const mappedProxiedPort: any = {
                        id: proxiedPort.id,
                        serviceId: proxiedPort.serviceId,
                        port: parseInt(proxiedPort.port, 10),
                        name: proxiedPort.name,
                    };

                    if (!proxiedPort.useDefaultNginxConfigTemplate) {
                        mappedProxiedPort.nginx_config_template =
                            proxiedPort.nginxConfigTemplate;
                    }

                    return mappedProxiedPort;
                },
            ),
            envVariables: this.definition.recipe.envVariables,
            composeFiles: [this.definition.recipe.composeFile],
            actions: this.definition.recipe.actions.map(action => ({
                id: action.id,
                type: action.type,
                name: action.name,
                afterBuildTasks: action.afterBuildTasks.map(afterBuildTask => {
                    const mappedAfterBuildTask = _.cloneDeep(afterBuildTask);
                    if (
                        'execute_service_command' === mappedAfterBuildTask.type
                    ) {
                        this.filterAfterBuildExecuteCommandTask(
                            mappedAfterBuildTask as ExecuteServiceCommandTaskFormElement,
                        );
                    }
                    if ('' === mappedAfterBuildTask.id) {
                        delete mappedAfterBuildTask.id;
                    }
                    if (0 === mappedAfterBuildTask.dependsOn.length) {
                        delete mappedAfterBuildTask.dependsOn;
                    }

                    return mappedAfterBuildTask;
                }),
            })),
            summaryItems: this.definition.recipe.summaryItems,
            downloadables: this.definition.recipe.downloadables,
        };

        for (const assetVolume of recipe.assetVolumes) {
            if ('' === assetVolume.assetId) {
                delete assetVolume.assetId;
            }
        }

        for (const action of this.definition.recipe.actions) {
            const clonedAfterBuildTasks = _.cloneDeep(action.afterBuildTasks);
            for (const afterBuildTask of clonedAfterBuildTasks) {
            }
        }

        const dto = {
            projectId: this.project.id,
            name: this.definition.name,
            recipeAsYaml: jsYaml.safeDump(
                snakeCaseKeys(recipe, { deep: true }),
                { indent: 4, flowLevel: -1 },
            ),
        };

        return dto;
    }

    protected filterAfterBuildExecuteCommandTask(
        afterBuildTask: ExecuteServiceCommandTaskFormElement,
    ) {
        afterBuildTask.command = _.filter(
            afterBuildTask.command,
            commandPart => !/^ *$/.test(commandPart),
        );
        for (const inheritedEnvVariable of afterBuildTask.inheritedEnvVariables) {
            if (/^ *$/.test(inheritedEnvVariable.alias)) {
                inheritedEnvVariable.alias = null;
            }
        }
    }

    protected getCreateDefinitionMutation(): string {
        const mutation = {
            mutation: {
                createDefinition: {
                    __args: this.mapDefinitionToDto(),
                    id: true,
                    name: true,
                },
            },
        };

        return jsonToGraphQLQuery(mutation);
    }

    protected getProject(): void {
        this.spinner.show();
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    return this.apollo
                        .watchQuery<GetProjectQueryInterface>({
                            query: getProjectQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges.pipe(
                            map(result => {
                                return result.data.project;
                            }),
                        );
                }),
            )
            .subscribe((project: GetProjectQueryProjectFieldInterface) => {
                this.project = project;
                this.spinner.hide();
            });
    }
}
