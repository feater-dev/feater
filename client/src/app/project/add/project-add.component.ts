import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";

import 'rxjs/add/operator/switchMap';

import { ProjectAddForm } from '../project-add-form.model';

@Component({
    selector: 'app-project-add',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2>Add project</h2>
                </div>
            </div>
        </div>
        <form class="form-horizontal">
            <div class="row">
                <div class="col-lg-12">
                    <div class="well bs-component">
                        <div class="form-group">
                            <label for="inputProjectName" class="col-lg-2 control-label">Name</label>
                            <div class="col-lg-10">
                                <input type="text" class="form-control" id="inputProjectName" name="name" [(ngModel)]="item.name">
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
export class ProjectAddComponent implements OnInit {

    item: ProjectAddForm;

    constructor(
        private router: Router,
        @Inject('repository.project') private repository
    ) {
        this.item = {
            name: ''
        };
    }

    ngOnInit() {
    }

    goToList() {
        this.router.navigate(['/projects']);
    }

    addItem() {
        this.repository
            .addItem(this.item)
            .subscribe(
                (id: string) => { this.router.navigate(['/project', id]); }
            );
    }
}
