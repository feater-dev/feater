import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    getInstanceDetailQueryGql,
    GetInstanceDetailQueryInstanceFieldinterface,
    GetInstanceDetailQueryInterface,
} from './get-instance-detail.query';


@Component({
    selector: 'app-instance-detail',
    templateUrl: './instance-detail.component.html',
    styles: []
})
export class InstanceDetailComponent implements OnInit {

    item: GetInstanceDetailQueryInstanceFieldinterface;

    errorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItem();
    }

    goToList() {
        this.router.navigate(['/instances']);
    }

    goToProjectDetails() {
        this.router.navigate(['/project', this.item.definition.project.id]);
    }

    goToDefinitionDetails() {
        this.router.navigate(['/definition', this.item.definition.id]);
    }

    private getItem() {
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<GetInstanceDetailQueryInterface>({
                            query: getInstanceDetailQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.instance;
                            })
                        );
                }
            ))
            .subscribe(
                (item: GetInstanceDetailQueryInstanceFieldinterface) => {
                    this.item = item;
                },
                (error) => { this.errorMessage = <any>error; }
            );
    }

}
