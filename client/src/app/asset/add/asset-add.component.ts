import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {AssetAddForm} from './asset-add-form.model';
import {
    getProjectQueryGql,
    GetProjectQueryInterface,
    GetProjectQueryProjectFieldInterface
} from './get-project.query';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'app-asset-add',
    templateUrl: './asset-add.component.html',
    styles: []
})
export class AssetAddComponent implements OnInit {

    asset: AssetAddForm;

    project: GetProjectQueryProjectFieldInterface;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected httpClient: HttpClient,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
    ) {
        this.asset = {
            id: '',
            description: '',
            file: null,
        };
    }

    ngOnInit() {
        this.getProject();
    }

    createItem() {
        this.spinner.show();
        this.apollo
            .mutate({
                mutation: gql`${this.getCreateAssetMutation()}`,
            })
            .subscribe(
                ({data}) => {
                    this.spinner.show();
                    this.toastr.info(`Uploading file for asset <em>${data.createAsset.id}</em>.`);
                    const uploadData = new FormData();
                    uploadData.set('asset', this.asset.file);
                    this.httpClient
                        .post(
                            [
                                environment.serverBaseUrl,
                                'upload',
                                'asset',
                                data.createAsset.project.id,
                                data.createAsset.id
                            ].join('/'),
                            uploadData
                        )
                        .subscribe(
                            () => {
                                this.spinner.hide();
                                this.toastr.success(`Upload completed, asset <em>${data.createAsset.id}</em> created.`);
                                this.router.navigate(['/asset', this.project.id, data.createAsset.id]);
                            },
                            (error) => {
                                this.spinner.hide();
                                this.toastr.error(`Failed to upload file and create asset <em>${this.asset.id}</em>.`);
                                this.router.navigate(['/asset', this.project.id]);
                            }
                        );
                },
                (error) => {
                    this.spinner.hide();
                    this.toastr.error(`Failed to create asset <em>${this.asset.id}</em>.`);
                    this.router.navigate(['/asset', this.project.id]);
                }
            );
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            this.asset.file = event.target.files[0];
        }
    }

    protected getProject(): void {
        this.spinner.show();
        this.apollo
            .watchQuery<GetProjectQueryInterface>({
                query: getProjectQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetProjectQueryInterface = result.data;
                this.project = resultData.project;
                this.spinner.hide();
            });
    }

    protected getCreateAssetMutation(): string {
        const mutation = {
            mutation: {
                createAsset: {
                    __args: {
                        projectId: this.project.id,
                        id: this.asset.id,
                        description: this.asset.description,
                    },
                    id: true,
                    project: {
                        id: true,
                    },
                },
            },
        };

        return jsonToGraphQLQuery(mutation);
    }

}
