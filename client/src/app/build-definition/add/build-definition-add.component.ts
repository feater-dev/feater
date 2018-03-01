import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import 'rxjs/add/operator/switchMap';

import {
    BuildDefinitionAddForm,
    BuildDefinitionAddFormComponentFormElement,
    BuildDefinitionAddFormExternalPortFormElement,
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
                        <h3 style="display: inline;">Components</h3>
                        <a
                            class="btn btn-success btn-sm"
                            (click)="addComponent()"
                            style="position: relative; bottom: 5px; margin-left: 8px;"
                        >
                            Add component
                        </a>
                    </div>
                    <div class="col-lg-12">
                        <p *ngIf="0 === item.config.components.length">
                            No components defined.
                        </p>
                        <div *ngFor="let component of item.config.components">
                            <app-build-definition-add-component-form-element
                                [item]="component"
                                (deleteItem)="deleteComponent($event)"
                            ></app-build-definition-add-component-form-element>
                        </div>
                    </div>
                </div>

                <div class="row form-section">
                    <div class="col-lg-12">
                        <h3 style="display: inline;">External ports</h3>
                        <a
                            class="btn btn-success btn-sm"
                            (click)="addExternalPort()"
                            style="position: relative; bottom: 5px; margin-left: 8px;"
                        >
                            Add external port
                        </a>
                    </div>
                    <div class="col-lg-12">
                        <p *ngIf="0 === item.config.exposedPorts.length">
                            No external ports defined.
                        </p>
                        <div *ngFor="let externalPort of item.config.exposedPorts">
                            <app-build-definition-add-external-port-form-element
                                [item]="externalPort"
                                (deleteItem)="deleteExternalPort($event)"
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
                            [components]="this.item.config.components"
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
                components: [],
                exposedPorts: [],
                environmentalVariables: [],
                composeFile: {
                    componentId: '',
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

    addComponent() : void {
        this.item.config.components.push({
            id: '',
            source: {
                type: 'github',
                name: ''
            },
            reference: {
                type: '',
                name: ''
            },
            beforeBuildTasks: []
        });
    }

    deleteComponent(component: BuildDefinitionAddFormComponentFormElement) : void {
        var index = this.item.config.components.indexOf(component);
        if (-1 !== index) {
            this.item.config.components.splice(index, 1);
        }
    }

    addExternalPort() : void {
        this.item.config.exposedPorts.push({
            id: '',
            port: 8000
        });
    }

    deleteExternalPort(externalPort: BuildDefinitionAddFormExternalPortFormElement) : void {
        var index = this.item.config.exposedPorts.indexOf(externalPort);
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
                components: {},
                exposedPorts: {},
                environmentalVariables: {},
                summaryItems: this.item.config.summaryItems,
                composeFile: this.item.config.composeFile
            }
        };

        this.item.config.components.forEach(
            function (component : BuildDefinitionAddFormComponentFormElement) {
                mappedItem.config.components[component.id] = {
                    source: component.source,
                    reference: component.reference,
                    beforeBuildTasks: component.beforeBuildTasks
                };
            }
        );
        this.item.config.exposedPorts.forEach(
            function (externalPort : BuildDefinitionAddFormExternalPortFormElement) {
                if (!mappedItem.config.exposedPorts[externalPort.id]) {
                    mappedItem.config.exposedPorts[externalPort.id] = [];
                }
                mappedItem.config.exposedPorts[externalPort.id].push(externalPort.port);
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
            components: [],
            exposedPorts: [],
            environmentalVariables: [],
            summaryItems: jsonConfig.summaryItems,
            composeFile: jsonConfig.composeFile
        };

        for (let id in jsonConfig.components) {
            let component = jsonConfig.components[id];
            component.id = id;
            mappedJsonConfig.components.push(component);
        }

        for (let id in jsonConfig.exposedPorts) {
            for (let port of jsonConfig.exposedPorts[id]) {
                mappedJsonConfig.exposedPorts.push({
                    id: id,
                    port: port
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
