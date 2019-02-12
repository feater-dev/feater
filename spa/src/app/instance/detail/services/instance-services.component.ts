import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getInstanceServicesQueryGql,
    GetInstanceServicesQueryInstanceFieldInterface,
    GetInstanceServicesQueryInterface,
} from './get-instance-services.query';
import gql from 'graphql-tag';
import {Subscription, interval} from 'rxjs';

@Component({
    selector: 'app-instance-services',
    templateUrl: './instance-services.component.html',
    styles: []
})
export class InstanceServicesComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 5000; // 5 seconds.

    instance: GetInstanceServicesQueryInstanceFieldInterface;

    pollingSubscription: Subscription;

    protected readonly stopServiceMutation = gql`
        mutation ($instanceId: String!, $serviceId: String!) {
            stopService(instanceId: $instanceId, serviceId: $serviceId, ) {
                id
            }
        }
    `;

    protected readonly pauseServiceMutation = gql`
        mutation ($instanceId: String!, $serviceId: String!) {
            pauseService(instanceId: $instanceId, serviceId: $serviceId, ) {
                id
            }
        }
    `;

    protected readonly startServiceMutation = gql`
        mutation ($instanceId: String!, $serviceId: String!) {
            startService(instanceId: $instanceId, serviceId: $serviceId, ) {
                id
            }
        }
    `;

    protected readonly unpauseServiceMutation = gql`
        mutation ($instanceId: String!, $serviceId: String!) {
            unpauseService(instanceId: $instanceId, serviceId: $serviceId, ) {
                id
            }
        }
    `;

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

    startOrUnpauseService(service) {
        switch (service.containerState) {
            case 'exited':
                this.apollo.mutate({
                    mutation: this.startServiceMutation,
                    variables: {
                        instanceId: this.instance.id,
                        serviceId: service.id,
                    },
                }).subscribe(
                    () => { this.getInstance(false); }
                );
                break;

            case 'paused':
                this.apollo.mutate({
                    mutation: this.unpauseServiceMutation,
                    variables: {
                        instanceId: this.instance.id,
                        serviceId: service.id,
                    },
                }).subscribe(
                    () => { this.getInstance(false); }
                );
                break;
        }
    }

    pauseService(service) {
        if (service.containerState === 'running') {
            this.apollo.mutate({
                mutation: this.pauseServiceMutation,
                variables: {
                    instanceId: this.instance.id,
                    serviceId: service.id,
                },
            }).subscribe(
                () => { this.getInstance(false); }
            );
        }
    }

    stopService(service) {
        if (service.containerState === 'running') {
            this.apollo.mutate({
                mutation: this.stopServiceMutation,
                variables: {
                    instanceId: this.instance.id,
                    serviceId: service.id,
                },
            }).subscribe(
                () => {
                    this.getInstance();
                }
            );
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
            .watchQuery<GetInstanceServicesQueryInterface>({
                query: getInstanceServicesQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceServicesQueryInterface = result.data;
                this.instance = resultData.instance;
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }
}
