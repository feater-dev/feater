import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailEnvironmentQueryGql,
    GetInstanceDetailEnvironmentQueryInstanceFieldinterface,
    GetInstanceDetailEnvironmentQueryInterface,
} from './get-instance-detail-environment.query';

@Component({
    selector: 'app-instance-detail-environment',
    templateUrl: './instance-detail-environment.component.html',
    styles: []
})
export class InstanceDetailEnvironmentComponent implements OnInit {

    instance: GetInstanceDetailEnvironmentQueryInstanceFieldinterface;

    constructor(
        private route: ActivatedRoute,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstance();
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailEnvironmentQueryInterface>({
                query: getInstanceDetailEnvironmentQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailEnvironmentQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
