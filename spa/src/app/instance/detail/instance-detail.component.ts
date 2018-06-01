import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {MappedInstance} from '../instance.model';
import {GetInstanceResponseDto} from '../instance-response-dtos.model';


@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styles: []
})
export class InstanceDetailComponent implements OnInit {

    item: MappedInstance;

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
        this.router.navigate(['/instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.definition.project._id]);
    }

    goToDefinitionDetails() {
        this.router.navigate(['/definition', this.item.definition._id]);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetInstanceResponseDto) => { this.item = this.mapItem(item); },
                (error) => { this.errorMessage = <any>error; }
            );
    }

    private mapItem(item: GetInstanceResponseDto): MappedInstance {
        return {
            _id: item._id,
            name: item.name,
            definition: item.definition,
            environmentalVariables: item.environmentalVariables,
            summaryItems: item.summaryItems
        } as MappedInstance;
    }

}
