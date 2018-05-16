import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {BuildInstanceAddForm} from '../../build-instance/build-instance-add-form.model';
import {GetBuildDefinitionResponseDto} from '../../build-definition/build-definition-response-dtos.model';
import {AddBuildInstanceResponseDto} from '../build-instance-response-dtos.model';

@Component({
    selector: 'app-build-instance-add',
    templateUrl: './build-instance-add.component.html',
    styles: []
})
export class BuildInstanceAddComponent implements OnInit {

    item: BuildInstanceAddForm;

    buildDefinition: GetBuildDefinitionResponseDto;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        @Inject('repository.buildDefinition') private buildDefinitionRepository
    ) {
        this.item = {
            buildDefinitionId: '',
            name: ''
        };
    }

    ngOnInit() {
        this.getBuildDefinition();
    }

    goToList() {
        this.router.navigate(['/build-instances']);
    }

    addItem() {
        this.repository
            .addItem(this.item)
            .subscribe(
                (addBuildInstanceResponseDto: AddBuildInstanceResponseDto) => {
                    this.router.navigate(['/build-instance', addBuildInstanceResponseDto.id]);
                }
            );
    }

    private getBuildDefinition() {
        this.route.params
            .switchMap(
                (params: Params) => this.buildDefinitionRepository.getItem(params['id'])
            )
            .subscribe(
                (item: GetBuildDefinitionResponseDto) => {
                    this.buildDefinition = item;
                    this.item.buildDefinitionId = item._id;
                }
            );

    }

}
