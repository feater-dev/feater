import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
import {
    getAssetDetailQueryGql,
    GetAssetDetailQueryInterface,
    GetAssetDetailQueryAssetFieldInterface,
} from './get-asset-detail.query';
import gql from 'graphql-tag';
import {ConfirmComponent} from '../../modal/confirm.component';
import {DialogService} from 'ng2-bootstrap-modal';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'app-asset-detail',
    templateUrl: './asset-detail.component.html',
    styles: []
})
export class AssetDetailComponent implements OnInit {

    asset: GetAssetDetailQueryAssetFieldInterface;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected dialogService: DialogService,
        protected toastr: ToastrService,
    ) {}

    ngOnInit() {
        this.getAsset();
    }

    removeAsset() {
        this.dialogService
            .addDialog(
                ConfirmComponent,
                {
                    title: 'Confirm',
                    message: 'Are you sure you wish to remove this asset? This operation cannot be reversed.',
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
                            mutation: gql`${this.getRemoveAssetMutation()}`,
                        }).subscribe(
                            () => {
                                this.spinner.hide();
                                this.toastr.success(`Asset <em>${this.asset.id}</em> removed.`);
                                this.router.navigateByUrl(`/project/${this.asset.project.id}`);
                            },
                            () => {
                                this.spinner.hide();
                                this.toastr.error(`Failed to remove asset <em>${this.asset.id}</em>.`);
                            },
                        );
                }
            );
    }

    protected getAsset() {
        this.spinner.show();

        return this.apollo
            .watchQuery<GetAssetDetailQueryInterface>({
                query: getAssetDetailQueryGql,
                variables: {
                    projectId: this.route.snapshot.params['projectId'],
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetAssetDetailQueryInterface = result.data;
                this.asset = resultData.asset;
                this.spinner.hide();
            });
    }

    protected getRemoveAssetMutation(): string {
        const mutation = {
            mutation: {
                removeAsset: {
                    __args: {
                        id: this.asset.id,
                        projectId: this.asset.project.id,
                    },
                },
            },
        };

        return jsonToGraphQLQuery(mutation);
    }
}
