import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {
    DefinitionAddForm,
    DefinitionAddFormSourceFormElement,
    DefinitionAddFormProxiedPortFormElement,
    DefinitionAddFormEnvVariableFormElement,
    DefinitionAddFormSummaryItemFormElement,
    DefinitionAddFormConfigFormElement,
    DefinitionAddFormAfterBuildExecuteHostCommandTaskFormElement,
    DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement, DefinitionAddFormAfterBuildTaskFormElement
} from './definition-add-form.model';
import {
    getProjectQueryGql,
    GetProjectQueryInterface,
    GetProjectQueryProjectFieldInterface
} from './get-project.query';


@Component({
    selector: 'app-definition-add',
    templateUrl: './definition-add.component.html',
    styles: []
})
export class DefinitionAddComponent implements OnInit {

    item: DefinitionAddForm;

    project: GetProjectQueryProjectFieldInterface;

    mode = 'form';

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.definition') private repository,
        @Inject('repository.project') private projectRepository,
        private apollo: Apollo,
    ) {
        this.item = {
            name: '',
            config: {
                sources: [],
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

    goToList(): void {
        this.router.navigate(['/definitions']);
    }

    addItem(): void {
        this.apollo.mutate({
            mutation: gql`${this.getCreateDefinitionMutation()}`,
        }).subscribe(
            ({data}) => {
                this.router.navigate(['/definition', data.createDefinition.id]);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    addSource(): void {
        this.item.config.sources.push({
            id: '',
            sshCloneUrl: '',
            reference: {
                type: '',
                name: ''
            },
            beforeBuildTasks: []
        });
    }

    deleteSource(source: DefinitionAddFormSourceFormElement): void {
        const index = this.item.config.sources.indexOf(source);
        if (-1 !== index) {
            this.item.config.sources.splice(index, 1);
        }
    }

    addProxiedPort(): void {
        this.item.config.proxiedPorts.push({
            serviceId: '',
            id: '',
            name: '',
            port: 8000
        });
    }

    deleteProxiedPort(proxiedPort: DefinitionAddFormProxiedPortFormElement): void {
        const index = this.item.config.proxiedPorts.indexOf(proxiedPort);
        if (-1 !== index) {
            this.item.config.proxiedPorts.splice(index, 1);
        }
    }

    addEnvVariable(): void {
        this.item.config.envVariables.push({
            name: '',
            value: ''
        });
    }

    deleteEnvVariable(envVariable: DefinitionAddFormEnvVariableFormElement): void {
        const index = this.item.config.envVariables.indexOf(envVariable);
        if (-1 !== index) {
            this.item.config.envVariables.splice(index, 1);
        }
    }

    addAfterBuildTaskExecuteHostCommand(): void {
        this.item.config.afterBuildTasks.push({
            type: 'executeHostCommand',
            command: ['', '', '', '', '', '', ''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as DefinitionAddFormAfterBuildExecuteHostCommandTaskFormElement);
    }

    addAfterBuildTaskExecuteServiceCommand(): void {
        this.item.config.afterBuildTasks.push({
            type: 'executeServiceCommand',
            command: ['', '', '', '', '', '', ''],
            inheritedEnvVariables: [],
            customEnvVariables: [],
        } as DefinitionAddFormAfterBuildExecuteServiceCommandTaskFormElement);
    }

    isAfterBuildTaskExecuteHostCommand(afterBuildTask: DefinitionAddFormAfterBuildTaskFormElement): boolean {
        return 'executeHostCommand' === afterBuildTask.type;
    }

    isAfterBuildTaskExecuteServiceCommand(afterBuildTask: DefinitionAddFormAfterBuildTaskFormElement): boolean {
        return 'executeServiceCommand' === afterBuildTask.type;
    }

    deleteAfterBuildTask(afterBuildTask: DefinitionAddFormAfterBuildTaskFormElement): void {
        const index = this.item.config.afterBuildTasks.indexOf(afterBuildTask);
        if (-1 !== index) {
            this.item.config.afterBuildTasks.splice(index, 1);
        }
    }

    addSummaryItem(): void {
        this.item.config.summaryItems.push({
            name: '',
            value: ''
        });
    }

    deleteSummaryItem(summaryItem: DefinitionAddFormSummaryItemFormElement): void {
        const index = this.item.config.summaryItems.indexOf(summaryItem);
        if (-1 !== index) {
            this.item.config.summaryItems.splice(index, 1);
        }
    }

    switchMode(mode: string): void {
        this.mode = mode;
    }

    toggleMode(): void {
        this.switchMode('json' === this.mode ? 'form' : 'json');
    }

    importJsonConfig(jsonConfig): void {
        this.item.config = this.mapJsonConfig(jsonConfig);
        this.switchMode('form');
    }

    getAvailableEnvVariableNames(): string[] {
        const availableEnvVariableNames = [];
        for (const envVariable of this.item.config.envVariables) {
            availableEnvVariableNames.push(envVariable.name);
        }
        availableEnvVariableNames.push('FEAT__INSTANCE_ID');
        for (const proxiedPort of this.item.config.proxiedPorts) {
            availableEnvVariableNames.push(`FEAT__PORT__${proxiedPort.id.toUpperCase()}`);
            availableEnvVariableNames.push(`FEAT__PROXY_DOMIAN__${proxiedPort.id.toUpperCase()}`);
        }

        return availableEnvVariableNames;
    }

    mapItem(): any {
        const mappedItem = {
            projectId: this.project.id,
            name: this.item.name,
            config: {
                sources: this.item.config.sources,
                proxiedPorts: this.item.config.proxiedPorts,
                envVariables: this.item.config.envVariables,
                summaryItems: this.item.config.summaryItems,
                composeFiles: [
                    {
                        sourceId: this.item.config.composeFile.sourceId,
                        envDirRelativePath: this.item.config.composeFile.envDirRelativePath,
                        composeFileRelativePaths: this.item.config.composeFile.composeFileRelativePaths,
                    },
                ],
            },
        };

        return mappedItem;
    }

    mapJsonConfig(jsonConfig: any): DefinitionAddFormConfigFormElement {
        // TODO Check schema validity of jsonConfig.

        jsonConfig = JSON.parse(jsonConfig);

        const mappedJsonConfig = {
            sources: [],
            proxiedPorts: [],
            envVariables: [],
            composeFile: null,
            afterBuildTasks: [],
            summaryItems: [],
        };

        for (const source of jsonConfig.sources) {
            mappedJsonConfig.sources.push(source);
        }

        for (const proxiedPort of jsonConfig.proxiedPorts) {
            mappedJsonConfig.proxiedPorts.push(proxiedPort);
        }

        for (const envVariable of jsonConfig.envVariables) {
            mappedJsonConfig.envVariables.push(envVariable);
        }

        mappedJsonConfig.composeFile = {
            sourceId: jsonConfig.composeFiles[0].sourceId,
            envDirRelativePath: jsonConfig.composeFiles[0].envDirRelativePath,
            composeFileRelativePaths: jsonConfig.composeFiles[0].composeFileRelativePaths,
        };

        for (const afterBuildTask of jsonConfig.afterBuildTasks) {
            mappedJsonConfig.afterBuildTasks.push(afterBuildTask);
        }

        for (const summaryItem of jsonConfig.summaryItems) {
            mappedJsonConfig.summaryItems.push(summaryItem);
        }

        return mappedJsonConfig;
    }

    protected getCreateDefinitionMutation(): string {
        const mutation = {
            mutation: {
                createDefinition: {
                    __args: this.mapItem(),
                    id: true,
                }
            }
        };

        return jsonToGraphQLQuery(mutation);
    }

    protected getProject(): void {
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
                (item: GetProjectQueryProjectFieldInterface) => {
                    this.project = item;
                },
                (error) => { this.errorMessage = <any>error; }
            );
    }

}
