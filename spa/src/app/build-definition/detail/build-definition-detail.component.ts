import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params} from "@angular/router";

import 'rxjs/add/operator/switchMap';

import { BuildDefinition } from '../build-definition.model';

@Component({
    selector: 'app-build-definition-detail',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <h2>Build definition <em>{{ item?.name }}</em></h2>
            </div>
        </div>
        <div class="form form-horizontal">
            <div class="row">
                <div class="col-lg-12">
                    <div class="well bs-component">
                        <div class="form-group">
                            <label for="inputBuildDefinitionName" class="col-lg-2 control-label">Name</label>
                            <div class="col-lg-10">
                                <p class="form-control-static">
                                    <a (click)="goToProjectDetails(item?.project)">{{ item?.project.name }}</a> /
                                    <span>{{ item?.name}}</span>
                                </p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputBuildDefinitionConfig" class="col-lg-2 control-label">Config</label>
                            <div class="col-lg-10">
                                <pre class="form-control-static" id="inputBuildDefinitionConfig">{{ item?.config | json }}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12" style="text-align: right;">
                <a class="btn btn-success" (click)="goToAddBuildInstance()">Add build instance</a>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionDetailComponent implements OnInit {

    item: BuildDefinition;

    errorMeessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.buildDefinition') private repository
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/build-definitions']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.project._id]);
    }

    goToAddBuildInstance() {
        this.router.navigate(['/build-definition', this.item._id, 'build-instance', 'add']);
    }

    private getItem() {
        this.route.params
            .switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            )
            .subscribe(
                (item: BuildDefinition) => { this.item = item },
                (error) => { this.errorMeessage = <any>error; }
            );
    }
}
