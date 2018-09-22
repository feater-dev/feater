import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailQueryGql,
    GetInstanceDetailQueryInstanceFieldinterface,
    GetInstanceDetailQueryInterface,
} from './get-instance-detail.query';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import gql from 'graphql-tag';

const POLLING_INTERVAL = 5000;

@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styles: []
})
export class InstanceDetailComponent implements OnInit, OnDestroy {

    instance: GetInstanceDetailQueryInstanceFieldinterface;

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
        private route: ActivatedRoute,
        private router: Router,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getInstance();
        const polling = Observable.interval(POLLING_INTERVAL);
        this.pollingSubscription = polling.subscribe(
            () => { this.getInstance(); },
        );
    }

    ngOnDestroy() {
        this.pollingSubscription.unsubscribe();
    }

    goToList() {
        this.router.navigate(['/instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.instance.definition.project.id]);
    }

    goToDefinitionDetails() {
        this.router.navigate(['/definition', this.instance.definition.id]);
    }

    getServiceById(id) {
        for (const service of this.instance.services) {
            if (id === service.id) {
                return service;
            }
        }
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
                    () => { this.getInstance(); }
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
                    () => { this.getInstance(); }
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
                () => {
                    this.getInstance();
                }
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

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailQueryInterface>({
                query: getInstanceDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
                fetchPolicy: 'network-only',
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
