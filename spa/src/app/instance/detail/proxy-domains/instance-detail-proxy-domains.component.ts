import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailProxyDomainsQueryGql,
    GetInstanceDetailProxyDomainsQueryInstanceFieldinterface,
    GetInstanceDetailProxyDomainsQueryInterface,
} from './get-instance-detail-proxy-domains.query';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-instance-detail-proxy-domains',
    templateUrl: './instance-detail-proxy-domains.component.html',
    styles: []
})
export class InstanceDetailProxyDomainsComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 5000; // 5 seconds.

    instance: GetInstanceDetailProxyDomainsQueryInstanceFieldinterface;

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

    getServiceById(id) {
        for (const service of this.instance.services) {
            if (id === service.id) {
                return service;
            }
        }
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailProxyDomainsQueryInterface>({
                query: getInstanceDetailProxyDomainsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailProxyDomainsQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
