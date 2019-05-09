import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getDeployKeyDetailQueryGql,
    GetDeployKeyDetailQueryInterface,
    GetDeployKeyDetailQueryDeployKeyFieldInterface,
} from './get-deploy-key-detail.query';
import gql from 'graphql-tag';
import {ConfirmComponent} from '../../modal/confirm.component';
import {DialogService} from 'ng2-bootstrap-modal';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'app-deploy-key-detail',
    templateUrl: './deploy-key-detail.component.html',
    styles: []
})
export class DeployKeyDetailComponent implements OnInit {

    deployKey: GetDeployKeyDetailQueryDeployKeyFieldInterface;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected dialogService: DialogService,
        protected toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        this.getDeployKey();
    }

    regenerateDeployKey(): void {
        this.spinner.show();
        this.apollo
            .mutate({
                mutation: gql`${this.getRegenerateDeployKeyMutation()}`,
            }).subscribe(
                () => {
                    this.toastr.success(`Deploy key for <em>${this.deployKey.cloneUrl}</em> regenerated.`);
                    this.spinner.hide();
                    this.getDeployKey();
                },
                () => {
                    this.toastr.error(`Failed to regenerate deploy key for <em>${this.deployKey.cloneUrl}</em>.`);
                    this.spinner.hide();
                    this.getDeployKey();
                }
            );
    }

    removeDeployKey(): void {
        this.dialogService
            .addDialog(
                ConfirmComponent,
                {
                    title: 'Confirm',
                    message: 'Are you sure you wish to remove this deploy key? This operation cannot be reversed.',
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
                    this.apollo
                        .mutate({
                            mutation: gql`${this.getRemoveDeployKeyMutation()}`,
                        }).subscribe(
                            () => {
                                this.spinner.hide();
                                this.toastr.success(`Deploy key for <em>${this.deployKey.cloneUrl}</em> removed.`);
                                this.router.navigate(['/deploy-keys']);
                            },
                            (error) => {
                                this.toastr.error(`Failed to remove deploy key for <em>${this.deployKey.cloneUrl}</em>.`);
                                this.getDeployKey();
                            },
                        );
                }
            );
    }

    protected getDeployKey(): void {
        this.spinner.show();

        this.apollo
            .watchQuery<GetDeployKeyDetailQueryInterface>({
                query: getDeployKeyDetailQueryGql,
                variables: {id: this.route.snapshot.params['id']},
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetDeployKeyDetailQueryInterface = result.data;
                this.deployKey = resultData.deployKey;
                this.spinner.hide();
            });
    }

    protected getRegenerateDeployKeyMutation(): string {
        const jsonQuery = {
            mutation: {
                regenerateDeployKey: {
                    __args: {
                        cloneUrl: this.deployKey.cloneUrl,
                    },
                    cloneUrl: true,
                },
            },
        };

        return jsonToGraphQLQuery(jsonQuery)
    };

    protected getRemoveDeployKeyMutation(): string {
        const jsonQuery = {
            mutation: {
                removeDeployKey: {
                    __args: {
                        cloneUrl: this.deployKey.cloneUrl,
                    },
                    removed: true,
                },
            },
        };

        return jsonToGraphQLQuery(jsonQuery)
    };

}
