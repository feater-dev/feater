import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getInstanceSummaryQueryGql,
    GetInstanceSummaryQueryInstanceFieldInterface,
    GetInstanceSummaryQueryInterface,
} from './get-instance-summary.query';
import {Subscription, interval} from 'rxjs';
import gql from 'graphql-tag';
import {ConfirmComponent} from '../../../modal/confirm.component';
import {DialogService} from 'ng2-bootstrap-modal';


@Component({
    selector: 'app-instance-summary',
    templateUrl: './instance-summary.component.html',
    styles: []
})
export class InstanceSummaryComponent implements OnInit, OnDestroy {

    instance: GetInstanceSummaryQueryInstanceFieldInterface;

    protected readonly POLLING_INTERVAL = 5000; // 5 seconds.

    protected pollingSubscription: Subscription;

    protected readonly removeInstanceMutation = gql`
        mutation ($id: String!) {
            removeInstance(id: $id)
        }
    `;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected dialogService: DialogService,
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

    removeInstance() {
        this.dialogService
            .addDialog(
                ConfirmComponent,
                {
                    title: 'Confirm',
                    message: 'Are you sure you wish to remove this instance? This operation cannot be reversed.',
                    ok: 'Confirm removal',
                    cancel: 'Cancel',
                }
            )
            .subscribe(
                (isConfirmed) => {
                    if (!isConfirmed) {
                        return;
                    }
                    this.spinner.show();
                    this.apollo.mutate({
                        mutation: this.removeInstanceMutation,
                        variables: {
                            id: this.instance.id,
                        },
                    }).subscribe(
                        () => {
                            this.router.navigateByUrl(`/definition/${this.instance.definition.id}`);
                            this.spinner.hide();
                        }
                    );
                }
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
            .watchQuery<GetInstanceSummaryQueryInterface>({
                query: getInstanceSummaryQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetInstanceSummaryQueryInterface = result.data;
                this.instance = resultData.instance;
                if (spinner) {
                    this.spinner.hide();
                }
            });
    }
}
