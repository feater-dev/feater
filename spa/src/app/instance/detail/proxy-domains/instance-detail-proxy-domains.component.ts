import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getInstanceDetailProxyDomainsQueryGql,
    GetInstanceDetailProxyDomainsQueryInstanceFieldinterface,
    GetInstanceDetailProxyDomainsQueryInterface,
} from './get-instance-detail-proxy-domains.query';
import {interval, Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-instance-detail-proxy-domains',
    templateUrl: './instance-detail-proxy-domains.component.html',
    styles: []
})
export class InstanceDetailProxyDomainsComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 2000; // 2 seconds.

    instance: GetInstanceDetailProxyDomainsQueryInstanceFieldinterface;

    pollingSubscription: Subscription;

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = interval(this.POLLING_INTERVAL);
        this.pollingSubscription = polling.subscribe(
            () => { this.getInstance(false); },
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

    protected getInstance(spinner: boolean = true) {
        if (spinner) {
            this.spinner.show();
        }
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
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }

}
