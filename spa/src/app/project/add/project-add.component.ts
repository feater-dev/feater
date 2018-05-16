import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {ProjectAddForm} from '../project-add-form.model';
import {AddProjectResponseDto} from '../project-response-dtos.model';

@Component({
    selector: 'app-project-add',
    templateUrl: './project-add.component.html',
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

    ngOnInit() {}

    goToList() {
        this.router.navigate(['/projects']);
    }

    addItem() {
        this.repository
            .addItem(this.item)
            .subscribe(
                (projectAddItemResponse: AddProjectResponseDto) => {
                    this.router.navigate(['/project', projectAddItemResponse.id]);
                }
            );
    }
}
