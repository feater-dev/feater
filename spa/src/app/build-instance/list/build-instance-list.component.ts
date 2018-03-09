import { Component, OnInit, Inject } from '@angular/core';
import { Router} from "@angular/router";

import { BuildInstance } from '../build-instance.model';

@Component({
    selector: 'app-build-instance-list',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2 id="tables">Build instances</h2>
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
export class BuildInstanceListComponent implements OnInit {

    items: BuildInstance[];

    errorMeessage: string;

    constructor(
        private router: Router,
        @Inject('repository.build') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/build-instance', item._id]);
    }

    private getItems() {
        this
                .repository
                .getItems()
                .subscribe(
                        (items: BuildInstance[]) => { this.items = items; },
                        (error) => { this.errorMeessage = <any>error; }
                );
    }
}
