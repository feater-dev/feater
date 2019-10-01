import { Component, EventEmitter, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    GetDeployKeyListQueryDeployKeysFieldItemInterface,
    getDeployKeyListQueryGql,
    GetDeployKeyListQueryInterface,
} from './get-deploy-key-list.query';
import gql from 'graphql-tag';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from '../../modal/confirm.component';
import { ToastrService } from 'ngx-toastr';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import {
    ActionButtonInterface,
    ActionButtonType,
} from '../../title/title.component';

@Component({
    selector: 'app-deploy-key-list',
    templateUrl: './deploy-key-list.component.html',
    styles: [],
})
export class DeployKeyListComponent implements OnInit {
    deployKeys: GetDeployKeyListQueryDeployKeysFieldItemInterface[];

    actions: ActionButtonInterface[];

    constructor(
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected dialogService: DialogService,
        protected toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        this.setUpActions();
        this.getDeployKeys();
    }

    protected generateMissingItems(): void {
        this.spinner.show();
        this.apollo
            .mutate({
                mutation: gql`
                    ${this.getGenerateMissingDeployKeysMutation()}
                `,
            })
            .subscribe(
                () => {
                    this.toastr.success(`Missing deploy keys generated.`);
                    this.getDeployKeys();
                },
                () => {
                    this.toastr.error(
                        `Failed to generate missing deploy keys.`,
                    );
                    this.getDeployKeys();
                },
            );
    }

    protected removeUnusedItems(): void {
        this.dialogService
            .addDialog(ConfirmComponent, {
                title: 'Confirm',
                message:
                    'Are you sure you wish to remove unused deploy keys? This operation cannot be reversed.',
                ok: 'Confirm removal',
                cancel: 'Cancel',
            })
            .subscribe(isConfirmed => {
                if (!isConfirmed) {
                    return;
                }
                this.spinner.show();
                this.apollo
                    .mutate({
                        mutation: gql`
                            ${this.getRemoveUnusedDeployKeysMutation()}
                        `,
                    })
                    .subscribe(
                        () => {
                            this.toastr.success(`Unused deploy keys removed.`);
                            this.getDeployKeys();
                        },
                        () => {
                            this.toastr.error(
                                `Failed to remove unused deploy keys.`,
                            );
                            this.getDeployKeys();
                        },
                    );
            });
    }

    protected setUpActions(): void {
        const removeUnusedEventEmitter = new EventEmitter<void>();
        removeUnusedEventEmitter.subscribe(() => {
            this.removeUnusedItems();
        });

        const generateMissingItemsEventEmitter = new EventEmitter<void>();
        generateMissingItemsEventEmitter.subscribe(() => {
            this.generateMissingItems();
        });

        this.actions = [
            {
                type: ActionButtonType.success,
                label: 'Generate missing items',
                eventEmitter: generateMissingItemsEventEmitter,
            },
            {
                type: ActionButtonType.danger,
                label: 'Remove unused',
                eventEmitter: removeUnusedEventEmitter,
            },
        ];
    }

    protected getDeployKeys(): void {
        this.spinner.show();
        this.apollo
            .watchQuery<GetDeployKeyListQueryInterface>({
                query: getDeployKeyListQueryGql,
            })
            .valueChanges.subscribe(result => {
                const resultData: GetDeployKeyListQueryInterface = result.data;
                this.deployKeys = resultData.deployKeys;
                this.spinner.hide();
            });
    }

    protected getGenerateMissingDeployKeysMutation(): string {
        const jsonQuery = {
            mutation: {
                generateMissingDeployKeys: {
                    generated: true,
                },
            },
        };

        return jsonToGraphQLQuery(jsonQuery);
    }

    protected getRemoveUnusedDeployKeysMutation(): string {
        const jsonQuery = {
            mutation: {
                removeUnusedDeployKeys: {
                    removed: true,
                },
            },
        };

        return jsonToGraphQLQuery(jsonQuery);
    }
}
