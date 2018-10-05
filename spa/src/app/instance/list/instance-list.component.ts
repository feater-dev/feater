import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceListQueryGql,
    GetInstanceListQueryInstanceFieldItemInterface,
    GetInstanceListQueryInterface,
} from './get-instance-list.query';

@Component({
    selector: 'app-instance-list',
    templateUrl: './instance-list.component.html',
    styles: []
})
export class InstanceListComponent implements OnInit {

    instances: GetInstanceListQueryInstanceFieldItemInterface[];

    constructor(
        private route: ActivatedRoute,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstances();
    }

    private getInstances() {
        this.apollo
            .watchQuery<GetInstanceListQueryInterface>({
                query: getInstanceListQueryGql,
                variables: {
                    definitionId: this.route.snapshot.queryParams['definitionId'],
                    limit: this.route.snapshot.queryParams['limit'],
                    offset: this.route.snapshot.queryParams['offset'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceListQueryInterface = result.data;
                this.instances = resultData.instances;
            });
    }
}
