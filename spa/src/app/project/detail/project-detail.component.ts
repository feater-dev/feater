import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import 'rxjs/add/operator/switchMap';

import { Project } from '../project.model';

@Component({
    selector: 'app-project-detail',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2>Project <em>{{ item?.name }}</em></h2>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="well bs-component">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label for="inputProjectName" class="col-lg-2 control-label">Name</label>
                            <div class="col-lg-10">
                                <p class="form-control-static" id="inputProjectName">{{ item?.name}}</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12" style="text-align: right;">
                <a class="btn btn-success" (click)="goToAddBuildDefinition()">Add build definition</a>
            </div>
        </div>
    `,
    styles: []
})
export class ProjectDetailComponent implements OnInit {

    item: Project;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.project') private repository
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/projects']);
    }

    goToAddBuildDefinition() {
        this.router.navigate(['/project', this.item._id, 'build-definition', 'add']);
    }

    private getItem() {
        this.route.params
            .switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            )
            .subscribe(
                (item: Project) => { this.item = item },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
