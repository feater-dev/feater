import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import 'rxjs/add/operator/switchMap';

import {
    BuildDefinitionAddForm,
    BuildDefinitionAddFormSourceFormElement,
    BuildDefinitionAddFormExposedPortFormElement,
    BuildDefinitionAddFormEnvironmentalVariableFormElement,
    BuildDefinitionAddFormSummaryItemFormElement, BuildDefinitionAddFormConfigFormElement
} from '../../build-definition/build-definition-add-form.model';

import { Project } from '../../project/project.model';

@Component({
    selector: 'app-build-definition-add',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <h2>Add build definition for project <em>{{ project?.name}}</em></h2>
            </div>
        </div>
        <form class="form-horizontal build-defintion-add-form">

            <div class="row form-section">
                <div class="col-lg-12">
                    <h3 style="display: inline;">Basic information</h3>
                </div>
                <div class="col-lg-12">
                    <div class="well well-sm">
                        <div class="form-group">
                            <label class="col-lg-2 control-label">Name</label>
                            <div class="col-lg-10">
                                <input type="text" class="form-control" name="addBuildDefinition_name" [(ngModel)]="item.name">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row form-section">
                <div class="col-lg-12">
                    <a class="btn btn-primary btn-sm" (click)="toggleMode()">
                        {{ 'json' === mode ? 'Back to form': 'Import from JSON file' }}
                    </a>
                </div>
            </div>

            <div [hidden]="'form' !== mode">

                <div class="row form-section">
                    <div class="col-lg-12">
                        <h3 style="display: inline;">Sources</h3>
                        <a
                            class="btn btn-success btn-sm"
                            (click)="addSource()"
                            style="position: relative; bottom: 5px; margin-left: 8px;"
                        >
                            Add source
                        </a>
                    </div>
                    <div class="col-lg-12">
                        <p *ngIf="0 === item.config.sources.length">
                            No sources defined.
                        </p>
                        <div *ngFor="let source of item.config.sources">
                            <app-build-definition-add-source-form-element
                                [item]="source"
                                (deleteItem)="deleteSource($event)"
                            ></app-build-definition-add-source-form-element>
                        </div>
                    </div>
                </div>

                <div class="row form-section">
                    <div class="col-lg-12">
                        <h3 style="display: inline;">External ports</h3>
                        <a
                            class="btn btn-success btn-sm"
                            (click)="addExposedPort()"
                            style="position: relative; bottom: 5px; margin-left: 8px;"
                        >
                            Add external port
                        </a>
                    </div>
                    <div class="col-lg-12">
                        <p *ngIf="0 === item.config.exposedPorts.length">
                            No external ports defined.
                        </p>
                        <div *ngFor="let exposedPort of item.config.exposedPorts">
                            <app-build-definition-add-external-port-form-element
                                [item]="exposedPort"
                                (deleteItem)="deleteExposedPort($event)"
                            ></app-build-definition-add-external-port-form-element>
                        </div>
                    </div>
                </div>

                <div class="row form-section">
                    <div class="col-lg-12">
                        <h3 style="display: inline;">Environmental variables</h3>
                        <a
                            class="btn btn-success btn-sm"
                            (click)="addEnvironmentalVariable()"
                            style="position: relative; bottom: 5px; margin-left: 8px;"
                        >
                            Add environmental variable
                        </a>
                    </div>
                    <div class="col-lg-12">
                        <p *ngIf="0 === item.config.environmentalVariables.length">
                            No environmental variables defined.
                        </p>
                        <div *ngFor="let environmentalVariable of item.config.environmentalVariables">
                            <app-build-definition-add-environmental-variable-form-element
                                [item]="environmentalVariable"
                                (deleteItem)="deleteEnvironmentalVariable($event)"
                            ></app-build-definition-add-environmental-variable-form-element>
                        </div>
                    </div>
                </div>

                <div class="row form-section">
                    <div class="col-lg-12">
                        <h3 style="display: inline;">Compose file</h3>
                    </div>
                    <div class="col-lg-12">
                        <app-build-definition-add-compose-file-form-element
                            [item]="this.item.config.composeFile"
                            [sources]="this.item.config.sources"
                        ></app-build-definition-add-compose-file-form-element>
                    </div>
                </div>

                <div class="row form-section">
                    <div class="col-lg-12">
                        <h3 style="display: inline;">Summary items</h3>
                        <a
                            class="btn btn-success btn-sm"
                            (click)="addSummaryItem()"
                            style="position: relative; bottom: 5px; margin-left: 8px;"
                        >
                            Add summary item
                        </a>
                    </div>
                    <div class="col-lg-12">
                        <p *ngIf="0 === item.config.summaryItems.length">
                            No summary items defined.
                        </p>
                        <div *ngFor="let summaryItem of item.config.summaryItems">
                            <app-build-definition-add-summary-item-form-element
                                [item]="summaryItem"
                                (deleteItem)="deleteSummaryItem($event)"
                            ></app-build-definition-add-summary-item-form-element>
                        </div>
                    </div>
                </div>

            </div>

            <div [hidden]="'json' !== mode">

                <div class="row form-section">
                    <div class="col-lg-12">
                        <div class="well well-sm">
                            <div class="form-group">
                                <label class="col-lg-2 control-label">JSON config</label>
                                <div class="col-lg-10">
                                    <textarea class="form-control" rows="60" #jsonConfig name="addBuildDefinition_jsonConfig" [ngModel]="item.config | json"></textarea>
                                    <div style="text-align: right; margin-top: 6px;">
                                        <button type="submit" class="btn btn-success" (click)="importJsonConfig(jsonConfig.value)">Import</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="row form-section">
                <div class="col-lg-12" style="text-align: right;">
                    <button type="reset" class="btn btn-default" (click)="goToList()">Cancel</button>
                    <button type="submit" class="btn btn-success" (click)="addItem()">Submit</button>
                </div>
            </div>

        </form>
    `,
    styles: []
})
export class BuildDefinitionAddComponent implements OnInit {

    item: BuildDefinitionAddForm;

    project: Project;

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

    goToList() : void {
        this.router.navigate(['/build-definitions']);
    }

    addItem() : void {
        this.repository
            .addItem(this.mapItem())
            .subscribe(
                (id: string) => { this.router.navigate(['/build-definition', id]); }
            );
    }

    addSource() : void {
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

    deleteSource(source: BuildDefinitionAddFormSourceFormElement) : void {
        var index = this.item.config.sources.indexOf(source);
        if (-1 !== index) {
            this.item.config.sources.splice(index, 1);
        }
    }

    addExposedPort() : void {
        this.item.config.exposedPorts.push({
            serviceId: '',
            id: '',
            name: '',
            port: 8000
        });
    }

    deleteExposedPort(exposedPort: BuildDefinitionAddFormExposedPortFormElement) : void {
        var index = this.item.config.exposedPorts.indexOf(exposedPort);
        if (-1 !== index) {
            this.item.config.exposedPorts.splice(index, 1);
        }
    }

    addEnvironmentalVariable() : void {
        this.item.config.environmentalVariables.push({
            name: '',
            value: ''
        });
    }

    deleteEnvironmentalVariable(environmentalVariable: BuildDefinitionAddFormEnvironmentalVariableFormElement) : void {
        var index = this.item.config.environmentalVariables.indexOf(environmentalVariable);
        if (-1 !== index) {
            this.item.config.environmentalVariables.splice(index, 1);
        }
    }

    addSummaryItem() : void {
        this.item.config.summaryItems.push({
            name: '',
            value: ''
        });
    }

    deleteSummaryItem(summaryItem: BuildDefinitionAddFormSummaryItemFormElement) : void {
        var index = this.item.config.summaryItems.indexOf(summaryItem);
        if (-1 !== index) {
            this.item.config.summaryItems.splice(index, 1);
        }
    }

    switchMode(mode: string) : void {
        this.mode = mode;
    }

    toggleMode()  : void {
        this.switchMode('json' === this.mode ? 'form' : 'json');
    }

    importJsonConfig(jsonConfig) : void {
        this.item.config = this.mapJsonConfig(jsonConfig);
        this.switchMode('form');
    }

    mapItem() : Object {
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

    mapJsonConfig(jsonConfig : any) : BuildDefinitionAddFormConfigFormElement {
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

    private getProject() : void {
        this.route.params
            .switchMap(
                (params: Params) => this.projectRepository.getItem(params['id'])
            )
            .subscribe(
                (item: Project) => {
                    this.project = item;
                    this.item.projectId = item._id;
                }
            );

    }

}
