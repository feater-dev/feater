
import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {GetBuildDefinitionResponseDto} from '../build-definition-response-dtos.model';


@Component({
    selector: 'app-build-definition-detail',
    templateUrl: './build-definition-detail.component.html',
    styles: []
})
export class BuildDefinitionDetailComponent implements OnInit {

    item: GetBuildDefinitionResponseDto;

    errorMessage: string;

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
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetBuildDefinitionResponseDto) => { this.item = item },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
