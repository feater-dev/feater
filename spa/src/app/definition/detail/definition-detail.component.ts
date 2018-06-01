
import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {GetDefinitionResponseDto} from '../definition-response-dtos.model';


@Component({
    selector: 'app-definition-detail',
    templateUrl: './definition-detail.component.html',
    styles: []
})
export class DefinitionDetailComponent implements OnInit {

    item: GetDefinitionResponseDto;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.definition') private repository
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/definitions']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.project._id]);
    }

    goToAddInstance() {
        this.router.navigate(['/definition', this.item._id, 'instance', 'add']);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => this.repository.getItem(params['id'])
            ))
            .subscribe(
                (item: GetDefinitionResponseDto) => { this.item = item },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
