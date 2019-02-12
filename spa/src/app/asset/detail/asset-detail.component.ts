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


@Component({
    selector: 'app-asset-detail',
    templateUrl: './asset-detail.component.html',
    styles: []
})
export class AssetDetailComponent implements OnInit {

    asset: GetAssetDetailQueryAssetFieldInterface;

    protected readonly removeAssetMutation = gql`
        mutation ($id: String! $projectId: String!) {
            removeAsset(
                projectId: $projectId
                id: $id
            )
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
                    this.apollo.mutate({
                        mutation: this.removeAssetMutation,
                        variables: {
                            projectId: this.asset.project.id,
                            id: this.asset.id,
                        },
                    }).subscribe(
                        () => {
                            this.spinner.hide();
                            this.router.navigateByUrl(`/project/${this.asset.project.id}`);
                        }
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

}
