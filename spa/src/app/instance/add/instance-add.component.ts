import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {InstanceAddForm} from '../../instance/instance-add-form.model';
import {GetDefinitionResponseDto} from '../../definition/definition-response-dtos.model';
import {AddInstanceResponseDto} from '../instance-response-dtos.model';


@Component({
    selector: 'app-instance-add',
    templateUrl: './instance-add.component.html',
    styles: []
})
export class InstanceAddComponent implements OnInit {

    item: InstanceAddForm;

    definition: GetDefinitionResponseDto;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        @Inject('repository.definition') private definitionRepository
    ) {
        this.item = {
            definitionId: '',
            name: ''
        };
    }

    ngOnInit() {
        this.getDefinition();
    }

    goToList() {
        this.router.navigate(['/instances']);
    }

    addItem() {
        this.repository
            .addItem(this.item)
            .subscribe(
                (addInstanceResponseDto: AddInstanceResponseDto) => {
                    this.router.navigate(['/instance', addInstanceResponseDto.id]);
                }
            );
    }

    private getDefinition() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.definitionRepository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetDefinitionResponseDto) => {
                    this.definition = item;
                    this.item.definitionId = item._id;
                }
            );

    }

}
