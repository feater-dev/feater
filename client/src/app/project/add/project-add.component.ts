import {Component} from '@angular/core';
import {Router} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {ProjectAddForm} from './project-add-form.model';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
    selector: 'app-project-add',
    templateUrl: './project-add.component.html',
    styles: []
})
export class ProjectAddComponent {

    project: ProjectAddForm;

    constructor(
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected toastr: ToastrService,
    ) {
        this.project = {
            name: ''
        };
    }

    createProject() {
        this.spinner.show();
        this.apollo
            .mutate({
                mutation: gql`${this.getCreateProjectMutation()}`,
            })
            .subscribe(
                ({data}) => {
                    this.spinner.hide();
                    this.toastr.success(`Project <em>${data.createProject.name}</em> created.`);
                    this.router.navigate(['/project', data.createProject.id]);
                },
                (error) => {
                    this.spinner.hide();
                    this.toastr.error(`Failed to create project <em>${this.project.name}</em>.`);
                }
            );
    }

    protected getCreateProjectMutation(): string {
        const mutation = {
            mutation: {
                createProject: {
                    __args: {
                        name: this.project.name,
                    },
                    id: true,
                    name: true,
                }
            }
        };

        return jsonToGraphQLQuery(mutation);
    }
}
