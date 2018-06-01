import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {
    DefinitionAddForm,
    DefinitionAddFormSourceFormElement,
    DefinitionAddFormProxiedPortFormElement,
    DefinitionAddFormEnvironmentalVariableFormElement,
    DefinitionAddFormSummaryItemFormElement, DefinitionAddFormConfigFormElement
} from '../../definition/definition-add-form.model';
import {GetProjectResponseDto} from '../../project/project-response-dtos.model';
import {AddDefinitionResponseDto} from '../definition-response-dtos.model';


@Component({
    selector: 'app-definition-add',
    templateUrl: './definition-add.component.html',
    styles: []
})
export class DefinitionAddComponent implements OnInit {

    item: DefinitionAddForm;

    project: GetProjectResponseDto;

    mode: String = 'form';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.definition') private repository,
        @Inject('repository.project') private projectRepository
    ) {
        this.item = {
            projectId: '',
            name: '',
            config: {
                sources: [],
                proxiedPorts: [],
                environmentalVariables: [],
                composeFile: {
                    sourceId: '',
                    envDirRelativePath: '',
                    composeFileRelativePaths: [''],
                },
                summaryItems: []
            }
        };
    }

    ngOnInit() {
        this.getProject();
    }

    goToList(): void {
        this.router.navigate(['/definitions']);
    }

    addItem(): void {
        this.repository
            .addItem(this.mapItem())
            .subscribe(
                (addDefinitionResponseDto: AddDefinitionResponseDto) => {
                    this.router.navigate(['/definition', addDefinitionResponseDto.id]);
                }
            );
    }

    addSource(): void {
        this.item.config.sources.push({
            id: '',
            type: 'github',
            name: '',
            reference: {
                type: '',
                name: ''
            },
            beforeBuildTasks: []
        });
    }

    deleteSource(source: DefinitionAddFormSourceFormElement): void {
        var index = this.item.config.sources.indexOf(source);
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
        var index = this.item.config.proxiedPorts.indexOf(proxiedPort);
        if (-1 !== index) {
            this.item.config.proxiedPorts.splice(index, 1);
        }
    }

    addEnvironmentalVariable(): void {
        this.item.config.environmentalVariables.push({
            name: '',
            value: ''
        });
    }

    deleteEnvironmentalVariable(environmentalVariable: DefinitionAddFormEnvironmentalVariableFormElement): void {
        var index = this.item.config.environmentalVariables.indexOf(environmentalVariable);
        if (-1 !== index) {
            this.item.config.environmentalVariables.splice(index, 1);
        }
    }

    addSummaryItem(): void {
        this.item.config.summaryItems.push({
            name: '',
            value: ''
        });
    }

    deleteSummaryItem(summaryItem: DefinitionAddFormSummaryItemFormElement): void {
        var index = this.item.config.summaryItems.indexOf(summaryItem);
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

    mapItem(): Object {
        const mappedItem = {
            projectId: this.item.projectId,
            name: this.item.name,
            config: {
                sources: this.item.config.sources,
                proxiedPorts: this.item.config.proxiedPorts,
                environmentalVariables: this.item.config.environmentalVariables,
                summaryItems: this.item.config.summaryItems,
                composeFiles: [
                    {
                        sourceId: this.item.config.composeFile.sourceId,
                        envDirRelativePath: this.item.config.composeFile.envDirRelativePath,
                        composeFileRelativePaths: this.item.config.composeFile.composeFileRelativePaths,
                    }
                ]
            }
        };

        return mappedItem;
    }

    mapJsonConfig(jsonConfig: any): DefinitionAddFormConfigFormElement {
        // TODO Check schema validity of jsonConfig.

        jsonConfig = JSON.parse(jsonConfig);

        const mappedJsonConfig = {
            sources: [],
            proxiedPorts: [],
            environmentalVariables: [],
            summaryItems: [],
            composeFile: null
        };

        for (const source of jsonConfig.sources) {
            mappedJsonConfig.sources.push(source);
        }

        for (const proxiedPort of jsonConfig.proxiedPorts) {
            mappedJsonConfig.proxiedPorts.push(proxiedPort);
        }

        for (const environmentalVariable of jsonConfig.environmentalVariables) {
            mappedJsonConfig.environmentalVariables.push(environmentalVariable);
        }

        for (const summaryItem of jsonConfig.summaryItems) {
            mappedJsonConfig.summaryItems.push(summaryItem);
        }

        mappedJsonConfig.composeFile = {
            sourceId: jsonConfig.composeFiles[0].sourceId,
            envDirRelativePath: jsonConfig.composeFiles[0].envDirRelativePath,
            composeFileRelativePaths: jsonConfig.composeFiles[0].composeFileRelativePaths,
        };

        return mappedJsonConfig;
    }

    private getProject(): void {
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.projectRepository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetProjectResponseDto) => {
                    this.project = item;
                    this.item.projectId = item._id;
                }
            );

    }

}
