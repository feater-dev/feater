import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {map} from 'rxjs/operators';
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

    item: GetProjectDetailQueryProjectFieldInterface;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.project') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/projects']);
    }

    goToDefinitionDetail(id: string) {
        this.router.navigate(['/definition', id]);
    }

    goToAddDefinition() {
        this.router.navigate(['/project', this.item.id, 'definition', 'add']);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<GetProjectDetailQueryInterface>({
                            query: getProjectDetailQueryGql,
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
                (item: GetProjectDetailQueryProjectFieldInterface) => {
                    this.item = item;
                },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
