import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import 'rxjs/add/operator/switchMap';

import { BuildInstanceAddForm } from '../../build-instance/build-instance-add-form.model';
import { BuildDefinition } from '../../build-definition/build-definition.model';

@Component({
    selector: 'app-build-instance-add',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2>Add build instance for build definition <em>{{ buildDefinition?.name }}</em></h2>
                </div>
            </div>
        </div>
        <form class="form-horizontal">
            <div class="row">
                <div class="col-lg-12">
                    <div class="well bs-component">
                        <div class="form-group">
                            <label for="inputBuildInstanceName" class="col-lg-2 control-label">Name</label>
                            <div class="col-lg-10">
                                <input type="text" class="form-control" id="inputBuildInstanceName" placeholder="Name" name="name" [(ngModel)]="item.name">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12" style="text-align: right;">
                    <button type="reset" class="btn btn-default" (click)="goToList()">Cancel</button>
                    <button type="submit" class="btn btn-success" (click)="addItem()">Submit</button>
                </div>
            </div>
        </form>
    `,
    styles: []
})
export class BuildInstanceAddComponent implements OnInit {

    item: BuildInstanceAddForm;

    buildDefinition: BuildDefinition;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        @Inject('repository.buildDefinition') private buildDefinitionRepository
    ) {
        this.item = {
            buildDefinitionId: '',
            name: ''
        };
    }

    ngOnInit() {
        this.getBuildDefinition();
    }

    goToList() {
        this.router.navigate(['/build-instances']);
    }

    addItem() {
        this.repository
            .addItem(this.item)
            .subscribe(
                (id: string) => { this.router.navigate(['/build-instance', id]); }
            );
    }

    private getBuildDefinition() {
        this.route.params
            .switchMap(
                (params: Params) => this.buildDefinitionRepository.getItem(params['id'])
            )
            .subscribe(
                (item: BuildDefinition) => {
                    this.buildDefinition = item;
                    this.item.buildDefinitionId = item._id;
                }
            );

    }

}
