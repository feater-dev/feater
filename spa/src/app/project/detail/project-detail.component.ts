import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {
    getProjectDetailQueryGql,
    GetProjectDetailQueryInterface,
    GetProjectDetailQueryProjectFieldInterface,
} from './get-project-detail.query';


@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styles: []
})
export class ProjectDetailComponent implements OnInit {

    project: GetProjectDetailQueryProjectFieldInterface;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.project') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getProject();
    }

    goToList() {
        this.router.navigate(['/projects']);
    }

    goToDefinitionDetail(id: string) {
        this.router.navigate(['/definition', id]);
    }

    goToAddDefinition() {
        this.router.navigate(['/project', this.project.id, 'definition', 'add']);
    }

    private getProject() {
        return this.apollo
            .watchQuery<GetProjectDetailQueryInterface>({
                query: getProjectDetailQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges
            .subscribe(result => {
                const resultData: GetProjectDetailQueryInterface = result.data;
                this.project = resultData.project;
            });
    }
}
