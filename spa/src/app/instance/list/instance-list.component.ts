import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Apollo} from 'apollo-angular';
import {
    getInstanceListQueryGql,
    GetInstanceListQueryInstanceFieldItemInterface,
    GetInstanceListQueryInterface,
} from './get-instance-list.query';

@Component({
    selector: 'app-instance-list',
    templateUrl: './instance-list.component.html',
    styles: []
})
export class InstanceListComponent implements OnInit {

    items: GetInstanceListQueryInstanceFieldItemInterface[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('repository.build') private repository,
        private apollo: Apollo,
    ) {}

    ngOnInit() {
        this.getItems();
    }

    goToDetail(item) {
        this.router.navigate(['/instance', item.id]);
    }

    private getItems() {
        this.route.queryParams
            .pipe(
                switchMap(
                    (queryParams) => {
                        console.log(queryParams);
                        return this.apollo
                            .watchQuery<GetInstanceListQueryInterface>({
                                query: getInstanceListQueryGql,
                                variables: {
                                    definitionId: queryParams['definitionId'],
                                    limit: queryParams['limit'],
                                    offset: queryParams['offset'],
                                },
                            })
                            .valueChanges
                            .pipe(
                                map(result => result.data.instances)
                            );
                    }
                )
            )
            .subscribe(
                (items: GetInstanceListQueryInstanceFieldItemInterface[]) => {
                    this.items = items;
                }
            );

    }
}
