import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {NgxSpinnerService} from 'ngx-spinner';
import {DefinitionRecipeFormElement, ExecuteServiceCommandTaskFormElement} from '../recipe-form/definition-recipe-form.model';
import {getProjectQueryGql, GetProjectQueryInterface, GetProjectQueryProjectFieldInterface} from './get-project.query';
import {ToastrService} from 'ngx-toastr';
import {DefinitionRecipeYamlMapperService} from '../import-yaml/definition-recipe-yaml-mapper.service';
import gql from 'graphql-tag';
import _ from 'lodash';
import * as jsYaml from 'js-yaml';
import * as snakeCaseKeys from 'snakecase-keys';


interface DefinitionAddForm {
    name: string;
    recipe: DefinitionRecipeFormElement;
}

@Component({
    selector: 'app-definition-add',
    templateUrl: './definition-add.component.html',
    styles: []
})
export class DefinitionAddComponent implements OnInit {

    // TODO Change to enum.
    static readonly actionAdd = 'add';

    // TODO Change to enum.
    static readonly modeForm = 'form';

    // TODO Change to enum.
    static readonly modeYamlImport = 'recipeYaml';

    definition: DefinitionAddForm;

    project: GetProjectQueryProjectFieldInterface;

    action = DefinitionAddComponent.actionAdd;

    mode = DefinitionAddComponent.modeForm;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
        protected definitionRecipeYamlMapperComponent: DefinitionRecipeYamlMapperService,
    ) {
        this.definition = {
            name: '',
            recipe: {
                sources: [],
                sourceVolumes: [],
                assetVolumes: [],
                proxiedPorts: [],
                envVariables: [],
                composeFile: {
                    sourceId: '',
                    envDirRelativePath: '',
                    composeFileRelativePaths: [''],
                },
                afterBuildTasks: [],
                summaryItems: [],
            },
        };
    }

    ngOnInit() {
        this.getProject();
    }

    createDefinition(): void {
        this.spinner.show();
        this.apollo.mutate({
            mutation: gql`${this.getCreateDefinitionMutation()}`,
        }).subscribe(
            ({data}) => {
                this.spinner.hide();
                this.toastr.success(`Definition <em>${data.createDefinition.name}</em> created.`);
                this.router.navigate(['/definition', data.createDefinition.id]);
            },
            () => {
                this.spinner.hide();
                this.toastr.error(`Failed to create definition <em>${this.definition.name}</em>.`);
            }
        );
    }

    switchMode(mode: string): void {
        this.mode = mode;
    }

    toggleMode(): void {
        this.switchMode(
            DefinitionAddComponent.modeYamlImport === this.mode
                ? DefinitionAddComponent.modeForm
                : DefinitionAddComponent.modeYamlImport,
        );
    }

    isModeForm(): boolean {
        return DefinitionAddComponent.modeForm === this.mode;
    }

    isModeYamlImport(): boolean {
        return DefinitionAddComponent.modeYamlImport === this.mode;
    }

    importRecipeYaml(recipe: DefinitionRecipeFormElement): void {
        this.definition.recipe = recipe;
        this.switchMode(DefinitionAddComponent.modeForm);
    }

    protected mapDefinitionToDto(): any {
        for (const afterBuildTask of this.definition.recipe.afterBuildTasks) {
            if ('execute_service_command' === afterBuildTask.type) {
                this.filterAfterBuildExecuteCommandTask(afterBuildTask as ExecuteServiceCommandTaskFormElement);
            }
        }

        const recipe = {
            schemaVersion: '0.1.0',
            sources: this.definition.recipe.sources,
            sourceVolumes: this.definition.recipe.sourceVolumes,
            assetVolumes: this.definition.recipe.assetVolumes,
            proxiedPorts: this.definition.recipe.proxiedPorts.map(proxiedPort => {
                const mappedProxiedPort: any = {
                    id: proxiedPort.id,
                    serviceId: proxiedPort.serviceId,
                    port: parseInt(proxiedPort.port, 10),
                    name: proxiedPort.name,
                };

                if (!proxiedPort.useDefaultNginxConfigTemplate) {
                    mappedProxiedPort.nginx_config_template = proxiedPort.nginxConfigTemplate;
                }

                return mappedProxiedPort;
            }),
            envVariables: this.definition.recipe.envVariables,
            composeFiles: [
                this.definition.recipe.composeFile,
            ],
            afterBuildTasks: _.cloneDeep(this.definition.recipe.afterBuildTasks),
            summaryItems: this.definition.recipe.summaryItems,
        };

        for (const sourceVolume of recipe.sourceVolumes) {
            if ('' === sourceVolume.relativePath) {
                delete sourceVolume.relativePath;
            }
        }

        for (const assetVolume of recipe.assetVolumes) {
            if ('' === assetVolume.assetId) {
                delete assetVolume.assetId;
            }
        }

        for (const afterBuildTask of recipe.afterBuildTasks) {
            if ('' === afterBuildTask.id) {
                delete afterBuildTask.id;
            }
            if (0 === afterBuildTask.dependsOn.length) {
                delete afterBuildTask.dependsOn;
            }
        }

        const dto = {
            projectId: this.project.id,
            name: this.definition.name,
            recipeAsYaml: jsYaml.safeDump(
                snakeCaseKeys(recipe, {deep: true}),
                {indent: 4, flowLevel: -1},
            ),
        };

        return dto;
    }

    protected filterAfterBuildExecuteCommandTask(afterBuildTask: ExecuteServiceCommandTaskFormElement) {
        afterBuildTask.command = _.filter(afterBuildTask.command, (commandPart) => !/^ *$/.test(commandPart));
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
                }
            }
        };

        return jsonToGraphQLQuery(mutation);
    }

    protected getProject(): void {
        this.spinner.show();
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<GetProjectQueryInterface>({
                            query: getProjectQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.project;
                            })
                        );
                }
            ))
            .subscribe(
                (project: GetProjectQueryProjectFieldInterface) => {
                    this.project = project;
                    this.spinner.hide();
                }
            );
    }

}
