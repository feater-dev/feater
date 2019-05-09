import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getInstanceProxyDomainsQueryGql,
    GetInstanceProxyDomainsQueryInstanceFieldInterface,
    GetInstanceProxyDomainsQueryInterface,
} from './get-instance-proxy-domains.query';
import {Subscription, interval} from 'rxjs';
import {InstanceTabs} from '../tabs/instance-tabs.component';

@Component({
    selector: 'app-instance-proxy-domains',
    templateUrl: './instance-proxy-domains.component.html',
    styles: []
})
export class InstanceProxyDomainsComponent implements OnInit, OnDestroy {

    readonly instanceTabs = InstanceTabs;

    instance: GetInstanceProxyDomainsQueryInstanceFieldInterface;

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

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    protected getInstance(spinner = true) {
        if (spinner) {
            this.spinner.show();
        }
        this.apollo
            .watchQuery<GetInstanceProxyDomainsQueryInterface>({
                query: getInstanceProxyDomainsQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceProxyDomainsQueryInterface = result.data;
                this.instance = resultData.instance;
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }
}
