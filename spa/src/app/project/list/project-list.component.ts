import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from '../project.model';

@Component({
    selector: 'app-project-list',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <a class="btn btn-success pull-right" (click)="goToAdd()">Add</a>
                    <h2 id="tables">Projects</h2>
                </div>
                <table class="table table-striped table-hover ">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th class="fit-column">Id</th>
                            <th class="fit-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of items">
                            <td>{{ item.name }}</td>
                            <td class="fit-column"><small>{{ item._id }}</small></td>
                            <td class="fit-column">
                                <a class="btn btn-primary btn-sm" (click)="goToDetail(item)">Details</a>
                            </td>
                        </tr>
                    </tbody>
                </table> 
            </div>
        </div>
    `,
    styles: []
})
export class ProjectListComponent implements OnInit {

    items: Project[];

    errorMessage: string;

    constructor(
            private router: Router,
            @Inject('repository.project') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/project', item._id]);
    }

    goToAdd() {
        this.router.navigate(['/project/add']);
    }

    private getItems() {
        this
                .repository
                .getItems()
                .subscribe(
                        (items: Project[]) => { this.items = items; },
                        (error) => { this.errorMessage = <any>error; }
                );
    }
}
