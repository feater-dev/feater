import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';
import {
    DefinitionAddForm,
    DefinitionAddFormSourceFormElement,
    DefinitionAddFormVolumeFormElement,
    DefinitionAddFormProxiedPortFormElement,
    DefinitionAddFormEnvVariableFormElement,
    DefinitionAddFormSummaryItemFormElement,
    DefinitionAddFormConfigFormElement,
    ExecuteServiceCommandTaskFormElement,
    AfterBuildTaskFormElement,
    CopyAssetIntoContainerTaskFormElement,
} from './definition-add-form.model';
import {
    getProjectQueryGql,
    GetProjectQueryInterface,
    GetProjectQueryProjectFieldInterface,
} from './get-project.query';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'app-definition-add',
    templateUrl: './definition-add.component.html',
    styles: []
})
export class DefinitionAddComponent implements OnInit { // TODO Extract some shared base controller for add/edit/duplicate.

    static readonly actionAdd = 'add'; // TODO Change to enum.

    static readonly modeForm = 'form'; // TODO Change to enum.
    static readonly modeYamlImport = 'yaml'; // TODO Change to enum.

    definition: DefinitionAddForm;

    project: GetProjectQueryProjectFieldInterface;

    action = DefinitionAddComponent.actionAdd;

    mode = DefinitionAddComponent.modeForm;

    @ViewChild('yamlConfig') yamlConfigElement: ElementRef;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
    ) {
        this.definition = {
            name: '',
            config: {
                sources: [],
                volumes: [],
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

    addSource(): void {
        this.definition.config.sources.push({
            id: '',
            cloneUrl: '',
            reference: {
                type: 'branch',
                name: ''
            },
            beforeBuildTasks: []
        });
    }

    deleteSource(source: DefinitionAddFormSourceFormElement): void {
        const index = this.definition.config.sources.indexOf(source);
        if (-1 !== index) {
            this.definition.config.sources.splice(index, 1);
        }
    }

    addVolume(): void {
        this.definition.config.volumes.push({
            id: '',
            assetId: '',
        });
    }

    deleteVolume(volume: DefinitionAddFormVolumeFormElement): void {
        const index = this.definition.config.volumes.indexOf(volume);
        if (-1 !== index) {
            this.definition.config.volumes.splice(index, 1);
        }
    }

    addProxiedPort(): void {
        this.definition.config.proxiedPorts.push({
            serviceId: '',
            id: '',
            name: '',
            port: null,
        });
    }

    deleteProxiedPort(proxiedPort: DefinitionAddFormProxiedPortFormElement): void {
        const index = this.definition.config.proxiedPorts.indexOf(proxiedPort);
        if (-1 !== index) {
            this.definition.config.proxiedPorts.splice(index, 1);
        }
    }

    addEnvVariable(): void {
        this.definition.config.envVariables.push({
            name: '',
            value: ''
        });
    }

    deleteEnvVariable(envVariable: DefinitionAddFormEnvVariableFormElement): void {
        const index = this.definition.config.envVariables.indexOf(envVariable);
        if (-1 !== index) {
            this.definition.config.envVariables.splice(index, 1);
        }
    }

    addAfterBuildTaskExecuteServiceCommand(): void {
        this.definition.config.afterBuildTasks.push({
            type: 'executeServiceCommand',
            id: '',
            dependsOn: [],
            command: [''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as ExecuteServiceCommandTaskFormElement);
    }

    addAfterBuildTaskCopyAssetIntoContainer(): void {
        this.definition.config.afterBuildTasks.push({
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
        const index = this.definition.config.afterBuildTasks.indexOf(afterBuildTask);
        if (-1 !== index) {
            this.definition.config.afterBuildTasks.splice(index, 1);
        }
    }

    addSummaryItem(): void {
        this.definition.config.summaryItems.push({
            name: '',
            value: ''
        });
    }

    deleteSummaryItem(summaryItem: DefinitionAddFormSummaryItemFormElement): void {
        const index = this.definition.config.summaryItems.indexOf(summaryItem);
        if (-1 !== index) {
            this.definition.config.summaryItems.splice(index, 1);
        }
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

    importYamlConfig(yamlConfig): void {
        this.definition.config = this.mapYamlConfig(yamlConfig);
        this.yamlConfigElement.nativeElement.value = '';
        this.switchMode(DefinitionAddComponent.modeForm);
    }

    getAvailableEnvVariableNames(): string[] {
        const availableEnvVariableNames = [];
        for (const envVariable of this.definition.config.envVariables) {
            availableEnvVariableNames.push(envVariable.name);
        }
        availableEnvVariableNames.push('FEATER__INSTANCE_ID');
        for (const proxiedPort of this.definition.config.proxiedPorts) {
            availableEnvVariableNames.push(`FEATER__PROXY_DOMIAN__${proxiedPort.id.toUpperCase()}`);
        }

        return availableEnvVariableNames;
    }

    protected mapDefinitionToDto(): any {
        for (const afterBuildTask of this.definition.config.afterBuildTasks) {
            if ('executeServiceCommand' === afterBuildTask.type) {
                this.filterAfterBuildExecuteCommandTask(afterBuildTask as ExecuteServiceCommandTaskFormElement);
            }
        }

        const mappedItem = {
            projectId: this.project.id,
            name: this.definition.name,
            config: {
                sources: this.definition.config.sources,
                volumes: this.definition.config.volumes,
                proxiedPorts: this.definition.config.proxiedPorts.map(proxiedPort => ({
                    id: proxiedPort.id,
                    serviceId: proxiedPort.serviceId,
                    port: parseInt(proxiedPort.port, 10),
                    name: proxiedPort.name,
                })),
                envVariables: this.definition.config.envVariables,
                composeFiles: [
                    this.definition.config.composeFile,
                ],
                afterBuildTasks: _.cloneDeep(this.definition.config.afterBuildTasks),
                summaryItems: this.definition.config.summaryItems,
            },
        };

        for (const volume of mappedItem.config.volumes) {
            if ('' === volume.assetId) {
                delete volume.assetId;
            }
        }

        for (const afterBuildTask of mappedItem.config.afterBuildTasks) {
            if ('' === afterBuildTask.id) {
                delete afterBuildTask.id;
            }
            if (0 === afterBuildTask.dependsOn.length) {
                delete afterBuildTask.dependsOn;
            }
        }

        return mappedItem;
    }

    protected filterAfterBuildExecuteCommandTask(afterBuildTask: ExecuteServiceCommandTaskFormElement) {
        afterBuildTask.command = _.filter(afterBuildTask.command, (commandPart) => !/^ *$/.test(commandPart));
        for (const inheritedEnvVariable of afterBuildTask.inheritedEnvVariables) {
            if (/^ *$/.test(inheritedEnvVariable.alias)) {
                inheritedEnvVariable.alias = null;
            }
        }
    }

    protected mapYamlConfig(yamlConfig: any): DefinitionAddFormConfigFormElement {
        const camelCaseYamlConfig = camelCaseKeys(jsYaml.safeLoad(yamlConfig), {deep: true});

        const mappedYamlConfig = {
            sources: [],
            volumes: [],
            proxiedPorts: [],
            envVariables: [],
            composeFile: null,
            afterBuildTasks: [],
            summaryItems: [],
        };

        for (const source of camelCaseYamlConfig.sources) {
            mappedYamlConfig.sources.push(source);
        }

        for (const volume of camelCaseYamlConfig.volumes) {
            mappedYamlConfig.volumes.push(volume);
        }

        for (const proxiedPort of camelCaseYamlConfig.proxiedPorts) {
            mappedYamlConfig.proxiedPorts.push({
                id: proxiedPort.id,
                serviceId: proxiedPort.serviceId,
                port: `${proxiedPort.port}`,
                name: proxiedPort.name,
            });
        }

        for (const envVariable of camelCaseYamlConfig.envVariables) {
            mappedYamlConfig.envVariables.push(envVariable);
        }

        mappedYamlConfig.composeFile = {
            sourceId: camelCaseYamlConfig.composeFiles[0].sourceId,
            envDirRelativePath: camelCaseYamlConfig.composeFiles[0].envDirRelativePath,
            composeFileRelativePaths: camelCaseYamlConfig.composeFiles[0].composeFileRelativePaths,
        };

        for (const afterBuildTask of camelCaseYamlConfig.afterBuildTasks) {
            const mappedAfterBuildTask = afterBuildTask;

            if (!afterBuildTask.id) {
                mappedAfterBuildTask.id = '';
            }

            if (!afterBuildTask.dependsOn) {
                mappedAfterBuildTask.dependsOn = [];
            }

            mappedYamlConfig.afterBuildTasks.push(mappedAfterBuildTask);
        }

        for (const summaryItem of camelCaseYamlConfig.summaryItems) {
            mappedYamlConfig.summaryItems.push(summaryItem);
        }

        return mappedYamlConfig;
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
