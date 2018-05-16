import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {GetProjectResponseDto} from '../project-response-dtos.model';


@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styles: []
})
export class ProjectDetailComponent implements OnInit {

    item: GetProjectResponseDto;

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
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetProjectResponseDto) => { this.item = item },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
