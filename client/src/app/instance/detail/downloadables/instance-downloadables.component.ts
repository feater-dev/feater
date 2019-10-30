import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    getInstanceDownloadablesQueryGql,
    GetInstanceDownloadablesQueryInstanceFieldInterface,
    GetInstanceDownloadablesQueryInterface,
} from './get-instance-downloadables.query';
import { Subscription, interval } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InstanceTabs } from '../tabs/instance-tabs.component';

@Component({
    selector: 'app-instance-downloadables',
    templateUrl: './instance-downloadables.component.html',
    styles: [],
})
export class InstanceDownloadablesComponent implements OnInit, OnDestroy {
    readonly instanceTabs = InstanceTabs;

    instance: GetInstanceDownloadablesQueryInstanceFieldInterface;

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

    getDownloadUrl(downloadable: { id: string }): string {
        const downloadableUrlFragment =
            '/download/downloadable/:instanceId/:downloadableId';

        return (
            environment.serverBaseUrl +
            downloadableUrlFragment
                .replace(':instanceId', this.instance.id)
                .replace(':downloadableId', downloadable.id)
        );
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
    protected getInstance(spinner = true) {
        if (spinner) {
            this.spinner.show();
        }
        this.apollo
            .watchQuery<GetInstanceDownloadablesQueryInterface>({
                query: getInstanceDownloadablesQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetInstanceDownloadablesQueryInterface =
                    result.data;
                this.instance = resultData.instance;
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }
}
