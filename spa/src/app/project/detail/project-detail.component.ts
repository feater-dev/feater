import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getProject();
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
