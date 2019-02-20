import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {AssetAddForm} from './asset-add-form.model';
import {
    getProjectQueryGql,
    GetProjectQueryInterface,
    GetProjectQueryProjectFieldInterface
} from './get-project.query';
import {map, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
    selector: 'app-asset-add',
    templateUrl: './asset-add.component.html',
    styles: []
})
export class AssetAddComponent implements OnInit {

    protected readonly createAssetMutation = gql`
        mutation ($projectId: String!, $id: String!, $description: String!) {
            createAsset(projectId: $projectId, id: $id, description: $description) {
                id
                description
                project {
                    id
                }
            }
        }
    `;

    item: AssetAddForm;

    project: GetProjectQueryProjectFieldInterface;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected httpClient: HttpClient,
        protected spinner: NgxSpinnerService,
    ) {
        this.item = {
            id: '',
            description: '',
            file: null,
        };
    }

    ngOnInit() {
        this.getProject();
    }

    addItem() {
        this.apollo.mutate({
            mutation: this.createAssetMutation,
            variables: {
                projectId: this.project.id,
                id: this.item.id,
                description: this.item.description,
            },
        }).subscribe(
            ({data}) => {
                console.log(data);
                const uploadData = new FormData();
                uploadData.set('asset', this.item.file);
                this.httpClient
                    .post([environment.serverBaseUrl, 'upload', 'asset', data.createAsset.id].join('/'), uploadData)
                    .subscribe(
                        () => {
                            this.router.navigate([
                                '/asset',
                                data.createAsset.project.id,
                                data.createAsset.id,
                            ]);
                        }
                    );
            },
            (error) => {
                console.log(error);
            }
        );
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            this.item.file = event.target.files[0];
        }
    }

    protected getProject(): void {
        this.spinner.show();
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<GetProjectQueryInterface>({
                            query: getProjectQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.project;
                            })
                        );
                }
            ))
            .subscribe(
                (item: GetProjectQueryProjectFieldInterface) => {
                    this.project = item;
                    this.spinner.hide();
                }
            );
    }

}
