import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    GetDefinitionDetailQueryDefinitionFieldInterface,
    getDefinitionDetailQueryGql,
    GetDefinitionDetailQueryInterface
} from './get-definition-detail.query';


@Component({
    selector: 'app-definition-detail',
    templateUrl: './definition-detail.component.html',
    styles: []
})
export class DefinitionDetailComponent implements OnInit {

    item: GetDefinitionDetailQueryDefinitionFieldInterface;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.definition') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/definitions']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.project.id]);
    }

    goToInstanceDetail(id: string) {
        this.router.navigate(['/instance', id]);
    }

    goToAddInstance() {
        this.router.navigate(['/definition', this.item.id, 'instance', 'add']);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<GetDefinitionDetailQueryInterface>({
                            query: getDefinitionDetailQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.definition;
                            })
                        );
                }
            ))
            .subscribe(
                (item: GetDefinitionDetailQueryDefinitionFieldInterface) => {
                    this.item = item;
                },
                (error) => { this.errorMessage = <any>error; }
            );
    }
}
