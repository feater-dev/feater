import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    getInstanceServicesQueryGql,
    GetInstanceServicesQueryInstanceFieldInterface,
    GetInstanceServicesQueryInterface,
} from './get-instance-services.query';
import gql from 'graphql-tag';
import { Subscription, interval } from 'rxjs';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { ToastrService } from 'ngx-toastr';
import { InstanceTabs } from '../tabs/instance-tabs.component';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-instance-services',
    templateUrl: './instance-services.component.html',
    styles: [],
})
export class InstanceServicesComponent implements OnInit, OnDestroy {
    readonly instanceTabs = InstanceTabs;

    instance: GetInstanceServicesQueryInstanceFieldInterface;

    baseDownloadLogsUrl;

    protected readonly pollingInterval = 5000; // 5 seconds.

    protected pollingSubscription: Subscription;

    constructor(
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
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

    startOrUnpauseService(service) {
        switch (service.containerState) {
            case 'exited':
                this.toastr.info(`Starting service <em>${service.id}</em>.`);
                this.apollo
                    .mutate({
                        mutation: gql`
                            ${this.getServiceMutation('startService', service)}
                        `,
                    })
                    .subscribe(
                        () => {
                            this.toastr.success(
                                `Service <em>${service.id}</em> started.`,
                            );
                            this.getInstance(false);
                        },
                        () => {
                            this.toastr.error(
                                `Failed to start service <em>${service.id}</em>.`,
                            );
                            this.getInstance(false);
                        },
                    );
                break;

            case 'paused':
                this.toastr.info(`Unpausing service <em>${service.id}</em>.`);
                this.apollo
                    .mutate({
                        mutation: gql`
                            ${this.getServiceMutation(
                                'unpauseService',
                                service,
                            )}
                        `,
                    })
                    .subscribe(
                        () => {
                            this.toastr.success(
                                `Service <em>${service.id}</em> unpaused.`,
                            );
                            this.getInstance(false);
                        },
                        () => {
                            this.toastr.error(
                                `Failed to unpause service <em>${service.id}</em>.`,
                            );
                            this.getInstance(false);
                        },
                    );
                break;
        }
    }

    pauseService(service) {
        if (service.containerState !== 'running') {
            return;
        }

        this.toastr.info(`Pausing service <em>${service.id}</em>.`);

        this.apollo
            .mutate({
                mutation: gql`
                    ${this.getServiceMutation('pauseService', service)}
                `,
            })
            .subscribe(
                () => {
                    this.toastr.success(
                        `Service <em>${service.id}</em> paused.`,
                    );
                    this.getInstance(false);
                },
                () => {
                    this.toastr.error(
                        `Failed to pause service <em>${service.id}</em>.`,
                    );
                    this.getInstance(false);
                },
            );
    }

    stopService(service) {
        if (service.containerState !== 'running') {
            return;
        }

        this.toastr.info(`Stopping service <em>${service.id}</em>.`);
        this.apollo
            .mutate({
                mutation: gql`
                    ${this.getServiceMutation('stopService', service)}
                `,
            })
            .subscribe(
                () => {
                    this.toastr.success(
                        `Service <em>${service.id}</em> stopped.`,
                    );
                    this.getInstance();
                },
                () => {
                    this.toastr.error(
                        `Failed to stop service <em>${service.id}</em>.`,
                    );
                    this.getInstance();
                },
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
            .watchQuery<GetInstanceServicesQueryInterface>({
                query: getInstanceServicesQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetInstanceServicesQueryInterface =
                    result.data;
                this.instance = resultData.instance;
                this.baseDownloadLogsUrl = `${environment.serverBaseUrl}/download/docker-logs/${this.instance.id}`;
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }

    protected getServiceMutation(mutationName: string, service): string {
        const queryJson = { mutation: {} };
        queryJson.mutation[mutationName] = {
            __args: {
                instanceId: this.instance.id,
                serviceId: service.id,
            },
            id: true,
        };

        return jsonToGraphQLQuery(queryJson);
    }
}
