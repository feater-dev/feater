import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailSummaryQueryGql,
    GetInstanceDetailSummaryQueryInstanceFieldinterface,
    GetInstanceDetailSummaryQueryInterface,
} from './get-instance-detail-summary.query';
import {Observable, Subscription} from 'rxjs';
import gql from 'graphql-tag';

@Component({
    selector: 'app-instance-detail-summary',
    templateUrl: './instance-detail-summary.component.html',
    styles: []
})
export class InstanceDetailSummaryComponent implements OnInit, OnDestroy {

    readonly POLLING_INTERVAL = 5000; // 5 seconds.

    instance: GetInstanceDetailSummaryQueryInstanceFieldinterface;

    pollingSubscription: Subscription;

    protected readonly removeInstanceMutation = gql`
        mutation ($id: String!) {
            removeInstance(id: $id)
        }
    `;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
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

    removeInstance() {
        this.apollo.mutate({
            mutation: this.removeInstanceMutation,
            variables: {
                id: this.instance.id,
            },
        }).subscribe(
            () => {
                this.router.navigateByUrl(`/definition/${this.instance.definition.id}`);
            }
        );
    }

    private getInstance() {
        this.apollo
            .watchQuery<GetInstanceDetailSummaryQueryInterface>({
                query: getInstanceDetailSummaryQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
                fetchPolicy: 'network-only',
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceDetailSummaryQueryInterface = result.data;
                this.instance = resultData.instance;
            });
    }

}
