import {Component} from '@angular/core';
import {Router} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {ProjectAddForm} from './project-add-form.model';


@Component({
    selector: 'app-project-add',
    templateUrl: './project-add.component.html',
    styles: []
})
export class ProjectAddComponent {

    protected readonly createProjectMutation = gql`
        mutation ($name: String!) {
            createProject(name: $name) {
                id
            }
        }
    `;

    item: ProjectAddForm;

    constructor(
        private router: Router,
        private apollo: Apollo,
    ) {
        this.item = {
            name: ''
        };
    }

    addItem() {
        this.apollo.mutate({
            mutation: this.createProjectMutation,
            variables: {
                name: this.item.name,
            },
        }).subscribe(
            ({data}) => {
                this.router.navigate(['/project', data.createProject.id]);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
