import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {NgxSpinnerService} from 'ngx-spinner';
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
        protected route: ActivatedRoute,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
    ) {}

    ngOnInit() {
        this.getProject();
    }

    protected getProject() {
        this.spinner.show();

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
                this.spinner.hide();
            });
    }
}
