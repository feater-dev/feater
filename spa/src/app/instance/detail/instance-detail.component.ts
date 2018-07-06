import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailQueryGql,
    GetInstanceDetailQueryInstanceFieldinterface,
    GetInstanceDetailQueryInterface,
} from './get-instance-detail.query';

@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styles: []
})
export class InstanceDetailComponent implements OnInit {

    instance: GetInstanceDetailQueryInstanceFieldinterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.instance.definition.project.id]);
    }

    goToDefinitionDetails() {
        this.router.navigate(['/definition', this.instance.definition.id]);
    }

    getServiceById(id) {
        for (const service of this.instance.services) {
            if (id === service.id) {
                return service;
            }
        }
    }

    private getItem() {
        this.apollo
            .watchQuery<GetInstanceDetailQueryInterface>({
                query: getInstanceDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
