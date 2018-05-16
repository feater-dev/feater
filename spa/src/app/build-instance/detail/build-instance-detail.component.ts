import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {MappedBuildInstance} from '../build-instance.model';
import {GetBuildInstanceResponseDto} from '../build-instance-response-dtos.model';


@Component({
    selector: 'app-build-instance-detail',
    templateUrl: './build-instance-detail.component.html',
    styles: []
})
export class BuildInstanceDetailComponent implements OnInit {

    item: MappedBuildInstance;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/build-instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.buildDefinition.project._id]);
    }

    goToBuildDefinitionDetails() {
        this.router.navigate(['/build-definition', this.item.buildDefinition._id]);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetBuildInstanceResponseDto) => { this.item = this.mapItem(item); },
                (error) => { this.errorMessage = <any>error; }
            );
    }

    private mapItem(item: GetBuildInstanceResponseDto): MappedBuildInstance {
        return {
            _id: item._id,
            name: item.name,
            buildDefinition: item.buildDefinition,
            environmentalVariables: item.environmentalVariables,
            summaryItems: item.summaryItems
        } as MappedBuildInstance;
    }

}
