import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    getInstanceEnvironmentQueryGql,
    GetInstanceEnvironmentQueryInstanceFieldInterface,
    GetInstanceEnvironmentQueryInterface,
} from './get-instance-environment.query';
import { Subscription, interval } from 'rxjs';
import { InstanceTabs } from '../tabs/instance-tabs.component';

@Component({
    selector: 'app-instance-environment',
    templateUrl: './instance-environment.component.html',
    styles: [],
})
export class InstanceEnvironmentComponent implements OnInit, OnDestroy {
    readonly instanceTabs = InstanceTabs;

    instance: GetInstanceEnvironmentQueryInstanceFieldInterface;

    protected readonly pollingInterval = 5000; // 5 seconds.

    protected pollingSubscription: Subscription;

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = interval(this.pollingInterval);
        this.pollingSubscription = polling.subscribe(() => {
            this.getInstance(false);
        });
    }

    ngOnDestroy() {
        this.pollingSubscription.unsubscribe();
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    protected getInstance(spinner = true) {
        if (spinner) {
            this.spinner.show();
        }
        this.apollo
            .watchQuery<GetInstanceEnvironmentQueryInterface>({
                query: getInstanceEnvironmentQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetInstanceEnvironmentQueryInterface =
                    result.data;
                this.instance = resultData.instance;
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }
}
