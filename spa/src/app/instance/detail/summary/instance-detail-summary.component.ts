import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailSummaryQueryGql,
    GetInstanceDetailSummaryQueryInstanceFieldinterface,
    GetInstanceDetailSummaryQueryInterface,
} from './get-instance-detail-summary.query';

@Component({
    selector: 'app-instance-detail-summary',
    templateUrl: './instance-detail-summary.component.html',
    styles: []
})
export class InstanceDetailSummaryComponent implements OnInit {

    instance: GetInstanceDetailSummaryQueryInstanceFieldinterface;

    constructor(
        private route: ActivatedRoute,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstance();
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailSummaryQueryInterface>({
                query: getInstanceDetailSummaryQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailSummaryQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
