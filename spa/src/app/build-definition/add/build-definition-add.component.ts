import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {
    BuildDefinitionAddForm,
    BuildDefinitionAddFormSourceFormElement,
    BuildDefinitionAddFormExposedPortFormElement,
    BuildDefinitionAddFormEnvironmentalVariableFormElement,
    BuildDefinitionAddFormSummaryItemFormElement, BuildDefinitionAddFormConfigFormElement
} from '../../build-definition/build-definition-add-form.model';
import {GetProjectResponseDto} from '../../project/project-response-dtos.model';
import {AddBuildDefinitionResponseDto} from '../build-definition-response-dtos.model';


@Component({
    selector: 'app-build-definition-add',
    templateUrl: './build-definition-add.component.html',
    styles: []
})
export class BuildDefinitionAddComponent implements OnInit {

    item: BuildDefinitionAddForm;

    project: GetProjectResponseDto;

    mode: String = 'form';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.buildDefinition') private repository,
        @Inject('repository.project') private projectRepository
    ) {
        this.item = {
            projectId: '',
            name: '',
            config: {
                sources: [],
                exposedPorts: [],
                environmentalVariables: [],
                composeFile: {
                    sourceId: '',
                    relativePath: ''
                },
                summaryItems: []
            }
        };
    }

    ngOnInit() {
        this.getProject();
    }

    goToList(): void {
        this.router.navigate(['/build-definitions']);
    }

    addItem(): void {
        this.repository
            .addItem(this.mapItem())
            .subscribe(
                (addBuildDefinitionResponseDto: AddBuildDefinitionResponseDto) => {
                    this.router.navigate(['/build-definition', addBuildDefinitionResponseDto.id]);
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

    deleteSource(source: BuildDefinitionAddFormSourceFormElement): void {
        var index = this.item.config.sources.indexOf(source);
        if (-1 !== index) {
            this.item.config.sources.splice(index, 1);
        }
    }

    addExposedPort(): void {
        this.item.config.exposedPorts.push({
            serviceId: '',
            id: '',
            name: '',
            port: 8000
        });
    }

    deleteExposedPort(exposedPort: BuildDefinitionAddFormExposedPortFormElement): void {
        var index = this.item.config.exposedPorts.indexOf(exposedPort);
        if (-1 !== index) {
            this.item.config.exposedPorts.splice(index, 1);
        }
    }

    addEnvironmentalVariable(): void {
        this.item.config.environmentalVariables.push({
            name: '',
            value: ''
        });
    }

    deleteEnvironmentalVariable(environmentalVariable: BuildDefinitionAddFormEnvironmentalVariableFormElement): void {
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

    deleteSummaryItem(summaryItem: BuildDefinitionAddFormSummaryItemFormElement): void {
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
        var mappedItem = {
            projectId: this.item.projectId,
            name: this.item.name,
            config: {
                sources: {},
                exposedPorts: {},
                environmentalVariables: {},
                summaryItems: this.item.config.summaryItems,
                composeFile: this.item.config.composeFile
            }
        };

        this.item.config.sources.forEach(
            function (source : BuildDefinitionAddFormSourceFormElement) {
                mappedItem.config.sources[source.id] = {
                    type: source.type,
                    name: source.name,
                    reference: source.reference,
                    beforeBuildTasks: source.beforeBuildTasks
                };
            }
        );
        this.item.config.exposedPorts.forEach(
            function (exposedPort : BuildDefinitionAddFormExposedPortFormElement) {
                if (!mappedItem.config.exposedPorts[exposedPort.serviceId]) {
                    mappedItem.config.exposedPorts[exposedPort.serviceId] = [];
                }
                mappedItem.config.exposedPorts[exposedPort.serviceId].push({
                    id: exposedPort.id,
                    name: exposedPort.name,
                    port: exposedPort.port,
                });
            }
        );
        this.item.config.environmentalVariables.forEach(
            function (environmentalVariable : BuildDefinitionAddFormEnvironmentalVariableFormElement) {
                mappedItem.config.environmentalVariables[environmentalVariable.name] = environmentalVariable.value;
            }
        );

        return mappedItem;
    }

    mapJsonConfig(jsonConfig : any): BuildDefinitionAddFormConfigFormElement {
        // TODO Check schema validity of jsonConfig.

        jsonConfig = JSON.parse(jsonConfig);

        var mappedJsonConfig = {
            sources: [],
            exposedPorts: [],
            environmentalVariables: [],
            summaryItems: jsonConfig.summaryItems,
            composeFile: jsonConfig.composeFile
        };

        for (let id in jsonConfig.sources) {
            let source = jsonConfig.sources[id];
            source.id = id;
            mappedJsonConfig.sources.push(source);
        }

        for (let serviceId in jsonConfig.exposedPorts) {
            for (let exposedPort of jsonConfig.exposedPorts[serviceId]) {
                mappedJsonConfig.exposedPorts.push({
                    serviceId: serviceId,
                    id: exposedPort.id,
                    name: exposedPort.name,
                    port: exposedPort.port
                });
            }
        }

        for (let name in jsonConfig.environmentalVariables) {
            mappedJsonConfig.environmentalVariables.push({
                name: name,
                value: jsonConfig.environmentalVariables[name]
            });
        }

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
