import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailEnvironmentQueryGql,
    GetInstanceDetailEnvironmentQueryInstanceFieldinterface,
    GetInstanceDetailEnvironmentQueryInterface,
} from './get-instance-detail-environment.query';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-instance-detail-environment',
    templateUrl: './instance-detail-environment.component.html',
    styles: []
})
export class InstanceDetailEnvironmentComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 5000; // 5 seconds.

    instance: GetInstanceDetailEnvironmentQueryInstanceFieldinterface;

    pollingSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = Observable.interval(this.POLLING_INTERVAL);
        this.pollingSubscription = polling.subscribe(
            () => { this.getInstance(); },
        );
    }

    ngOnDestroy() {
        this.pollingSubscription.unsubscribe();
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailEnvironmentQueryInterface>({
                query: getInstanceDetailEnvironmentQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
                fetchPolicy: 'network-only',
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailEnvironmentQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
