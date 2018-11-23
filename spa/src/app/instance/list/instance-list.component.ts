import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
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
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getInstances();
    }

    protected getInstances() {
        this.spinner.show();
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
                this.spinner.hide();
            });
    }
}
