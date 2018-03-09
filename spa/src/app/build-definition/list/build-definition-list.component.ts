import { Component, OnInit, Inject } from '@angular/core';
import { Router} from "@angular/router";

import { BuildDefinition } from '../build-definition.model';

@Component({
    selector: 'app-build-definition-list',
    template: `
        <div class="row">
            <div class="col-lg-12">
                <div class="page-header">
                    <h2 id="tables">Build definitions</h2>
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
export class BuildDefinitionListComponent implements OnInit {

    items: BuildDefinition[];

    errorMeessage: string;

    constructor(
            private router: Router,
            @Inject('repository.buildDefinition') private repository
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/build-definition', item._id]);
    }

    private getItems() {
        this
                .repository
                .getItems()
                .subscribe(
                        (items: BuildDefinition[]) => { this.items = items; },
                        (error) => { this.errorMeessage = <any>error; }
                );
    }
}
