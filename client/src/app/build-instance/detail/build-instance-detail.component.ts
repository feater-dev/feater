import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params} from "@angular/router";

import 'rxjs/add/operator/switchMap';

import { BuildInstance, MappedBuildInstance } from '../build-instance.model';

@Component({
    selector: 'app-build-instance-detail',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2>Build instance <em>{{ item?.name }}</em></h2>
                </div>
            </div>
        </div>

        <div class="form form-horizontal">
            <div class="row">
                <div class="col-lg-12">
                    <div class="well bs-component">
                        <div class="form-group">
                            <label class="col-lg-2 control-label">Name</label>
                            <div class="col-lg-10">
                                <p class="form-control-static">
                                    <a (click)="goToProjectDetails(item?.buildDefinition.project)">{{ item?.buildDefinition.project.name }}</a> /
                                    <a (click)="goToBuildDefinitionDetails(item?.buildDefinition)">{{ item?.buildDefinition.name }}</a> /
                                    <span>{{ item?.name}}</span>
                                </p>
                            </div>
                        </div>

                        <div class="form-group" [hidden]="!item?.exposedPorts?.length">
                            <label class="col-lg-2 control-label">External ports</label>
                            <div class="col-lg-10">
                                <div
                                    *ngFor="let externalPort of item?.exposedPorts"
                                    class="form-control-static"
                                >
                                    <strong>{{ externalPort.id }}</strong><br>{{ externalPort.value }}
                                </div>
                            </div>
                        </div>

                        <div class="form-group" [hidden]="!item?.environmentalVariables?.length">
                            <label class="col-lg-2 control-label">Environmental variables</label>
                            <div class="col-lg-10">
                                <div
                                    *ngFor="let environmentalVariable of item?.environmentalVariables"
                                    class="form-control-static"
                                >
                                    <strong>{{ environmentalVariable.name }}</strong><br>{{ environmentalVariable.value }}
                                </div>
                            </div>
                        </div>

                        <div class="form-group" [hidden]="!item?.summaryItems?.length">
                            <label class="col-lg-2 control-label">Summary</label>
                            <div class="col-lg-10">
                                <div
                                    *ngFor="let summaryItem of item?.summaryItems"
                                    class="form-control-static"
                                >
                                    <strong>{{ summaryItem.name }}</strong><br>{{ summaryItem.value }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class BuildInstanceDetailComponent implements OnInit {

    item: MappedBuildInstance;

    errorMeessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.buildInstance') private repository
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/build-instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.buildDefinition.project._id]);
    }

    goToBuildDefinitionDetails() {
        this.router.navigate(['/build-definition', this.item.buildDefinition._id]);
    }

    private getItem() {
        this.route.params
            .switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            )
            .subscribe(
                (item: BuildInstance) => { this.item = this.mapItem(item); },
                (error) => { this.errorMeessage = <any>error; }
            );
    }

    private mapItem(item : BuildInstance) : MappedBuildInstance {
        var mappedItem : MappedBuildInstance = {
            _id: item._id,
            name: item.name,
            buildDefinition: item.buildDefinition,
            environmentalVariables: [],
            exposedPorts: [],
            summaryItems: item.summaryItems
        };

        if (item.exposedPorts && 0 < Object.keys(item.exposedPorts).length) {
            Object.keys(item.exposedPorts).forEach(function (id) {
                mappedItem.exposedPorts.push({
                    id,
                    value: item.exposedPorts[id]
                });
            });
        }

        if (item.environmentalVariables && 0 < Object.keys(item.environmentalVariables).length) {
            Object.keys(item.environmentalVariables).forEach(function (name) {
                mappedItem.environmentalVariables.push({
                    name,
                    value: item.environmentalVariables[name]
                });
            });
        }

        return mappedItem;
    }

}
